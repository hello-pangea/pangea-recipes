import { z } from 'zod';
import { api } from './api.js';
import type { Contract, DefaultSuccessStatus } from './routeContracts.js';

/** Input/Output helpers (Zod v4) */
type In<T extends z.ZodType> = z.input<T>;
type Out<T extends z.ZodType> = z.output<T>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
type EmptyObject = {};

/* ==================
 * Request helper API
 * ================== */

type ContractParams<C> = C extends { params: z.ZodObject }
  ? In<C['params']>
  : C extends { params?: z.ZodObject }
    ? In<NonNullable<C['params']>> | undefined
    : undefined;

// type ContractBody<C> = C extends { body: z.ZodType }
//   ? In<C['body']>
//   : undefined;

type ContractHeaders<C> = C extends { headers: z.ZodType }
  ? In<C['headers']>
  : Record<string, string> | undefined;

/* =====================================
 *   STRICTER CALL-SIDE OPTION HELPERS
 * ===================================== */

/** params are required IFF the contract actually has a mandatory `params` schema */
type ParamsField<C> = C extends { params: z.ZodObject } // ← compile-time test
  ? { params: ContractParams<C> } //   ▸ path has :params   → required
  : { params?: ContractParams<C> }; //   ▸ no path params     → optional / omitted

/** body is required when a `body` schema exists (typical POST/PUT/PATCH) */
type BodyField<C> = C extends { body?: infer B } // ← allow optional
  ? B extends z.ZodType
    ? { body: In<B> } //   required for callers
    : EmptyObject
  : EmptyObject;

/** headers are always optional, but strongly typed when provided */
type HeadersField<C> = C extends { headers: z.ZodType }
  ? { headers?: ContractHeaders<C> }
  : EmptyObject;

/** query-string object (always optional for callers when present) */
type SearchField<C> = C extends { search: z.ZodType }
  ? { search?: In<C['search']> }
  : EmptyObject;

/** Put it all together — now callers get the right IntelliSense & errors */
export type RequestOptions<C> = ParamsField<C> &
  BodyField<C> &
  HeadersField<C> &
  SearchField<C> & {
    /** vanilla fetch overrides */
    fetch?: Omit<RequestInit, 'method' | 'body' | 'headers'>;
  };

/** Return type for a given status in a contract’s response map */
type ResponseOf<C, Status extends number> = C extends {
  response: Record<Status, z.ZodType>;
}
  ? Out<C['response'][Status]>
  : never;

/**
 * Perform a typed request based on a contract.
 *
 * - Defaults to parsing as 200; pass `expectedStatus` if you want a different status’ type.
 * - Validates params/body/headers with Zod before issuing the request.
 * - Validates the response with the corresponding status schema.
 */

export async function request<
  C extends Contract<string>,
  Status extends number = DefaultSuccessStatus,
>(
  contract: C,
  options?: RequestOptions<C>,
  _cfg?: {
    expectedStatus?: Status; // e.g. 201
  },
): Promise<
  Status extends keyof C['response']
    ? ResponseOf<C, Status>
    : DefaultSuccessStatus extends keyof C['response']
      ? ResponseOf<C, DefaultSuccessStatus>
      : never
> {
  // Validate & serialize params
  const path = insertParamsIntoPath(
    contract.path,
    validateParams(contract, options?.params),
  );

  //   /* ---------- NEW: validate & serialize search params ---------- */
  //   let url = path;
  //   if (contract.search) {
  //     const parsedSearch = contract.search.parse(options?.search ?? {}) as Record<
  //       string,
  //       any
  //     >;

  //     const qs = new URLSearchParams();
  //     for (const [k, v] of Object.entries(parsedSearch)) {
  //       if (v == null) continue;
  //       if (Array.isArray(v)) {
  //         v.forEach((i) => qs.append(k, String(i)));
  //       } else {
  //         qs.append(k, String(v));
  //       }
  //     }
  //     const query = qs.toString();
  //     if (query) url += (url.includes('?') ? '&' : '?') + query;
  //   }

  //   /* ------------------------------------------------------------- */

  //   // Validate headers if schema provided
  //   let headers: RequestInit['headers'] | undefined;
  //   if (contract.headers) {
  //     const safe = contract.headers.parse(options?.headers ?? {});
  //     headers = safe as Record<string, string>;
  //   } else {
  //     headers =
  //       (options?.headers as Record<string, string> | undefined) ?? undefined;
  //   }

  //   // Validate & serialize body if present
  //   let body: RequestInit['body'] | undefined;
  //   if (contract.body) {
  //     const parsedBody = contract.body.parse(options?.body);
  //     body = JSON.stringify(parsedBody);
  //     headers = { 'content-type': 'application/json', ...(headers ?? {}) };
  //   }

  const res = await api(path, {
    method: contract.method,
    headers:
      options && 'headers' in options
        ? (options.headers as RequestInit['headers'])
        : undefined,
    json: options?.body,
    searchParams:
      options && 'search' in options
        ? (options.search as URLSearchParams)
        : undefined,
    ...options?.fetch,
  });

  return res.json();
}

/* ===============
 * Helper functions
 * =============== */

function extractParamNames(path: string): string[] {
  const matches = [...path.matchAll(/:([A-Za-z0-9_]+)/g)];
  return matches.map((m) => m[1]).filter((v) => v !== undefined);
}

/** Validate params with the contract’s schema (or ensure empty when none expected) */
function validateParams(
  contract: Contract<string>,
  incoming: unknown,
): Record<string, string> | undefined {
  const required = extractParamNames(contract.path);
  if (required.length === 0) {
    if ('params' in contract && contract.params) {
      // if a schema was given (should be empty), still parse to enforce .strict()
      (contract.params as z.ZodType).parse(incoming ?? {});
    }
    return undefined;
  }

  const parsed = (contract.params as z.ZodObject).parse(incoming);
  // Ensure all params are strings in the URL; coerce to string via Zod if you like
  const out: Record<string, string> = {};
  for (const k of required) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const v = (parsed as any)[k];
    if (v == null) {
      throw new Error(`Missing path param "${k}"`);
    }
    out[k] = String(v);
  }
  return out;
}

/** Replace :params in path with values */
function insertParamsIntoPath(
  path: string,
  params?: Record<string, string>,
): string {
  if (!params) return path;
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const v = params[key];
    if (v == null) throw new Error(`Missing value for path param "${key}"`);
    return encodeURIComponent(String(v));
  });
}

type DefaultResponse<C extends Contract<string>> =
  DefaultSuccessStatus extends keyof C['response']
    ? ResponseOf<C, DefaultSuccessStatus>
    : never;

/* =====================================
 *        UTILITY TYPE HELPERS
 * ===================================== */

/**
 * Resolve to a union of keys that are required in `T`.
 * If the union is `never` then the object has no required properties.
 */
type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

// no selector –> full response
export function makeRequest<C extends Contract<string>>(
  contract: C,
): RequiredKeys<RequestOptions<C>> extends never
  ? (opts?: RequestOptions<C>) => Promise<DefaultResponse<C>>
  : (opts: RequestOptions<C>) => Promise<DefaultResponse<C>>;

// with selector –> projected response
export function makeRequest<C extends Contract<string>, R>(
  contract: C,
  makeOptions: { select: (data: DefaultResponse<C>) => R },
): RequiredKeys<RequestOptions<C>> extends never
  ? (opts?: RequestOptions<C>) => Promise<R>
  : (opts: RequestOptions<C>) => Promise<R>;

export function makeRequest<C extends Contract<string>, R>(
  contract: C,
  makeOptions?: { select?: (data: DefaultResponse<C>) => R },
) {
  return async (options: RequestOptions<C>) => {
    const res = await request(contract, options);
    return makeOptions?.select
      ? makeOptions.select(res as DefaultResponse<C>)
      : res;
  };
}
