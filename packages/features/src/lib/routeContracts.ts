import { z } from 'zod/v4';

/* ======================
 * Utilities & base types
 * ====================== */

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

/** Extract a union of param names from a path like "/users/:id/books/:bookId" → "id" | "bookId" */
type PathParamNames<S extends string> = S extends `${string}:${infer Rest}`
  ? Rest extends `${infer Param}/${infer Tail}`
    ? Param | PathParamNames<Tail>
    : Rest
  : never;

/** True if the path has params */
type HasPathParams<S extends string> = [PathParamNames<S>] extends [never]
  ? false
  : true;

/** Zod object type that exactly matches the path params (no extras, all required) */
export type ParamSchemaFor<Path extends string> = z.ZodObject<
  Required<Record<PathParamNames<Path>, z.ZodType>>
>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
type EmptyObject = {};

/** When there are no path params, this is the only valid schema (empty, strict) */
export type EmptyParamsSchema = z.ZodObject<EmptyObject>;

/** Response map of status → zod schema */
type ResponseMap = Record<number, z.ZodType>;

/** Default success status used by request() when not specified */
export type DefaultSuccessStatus = 200;

/* ==========================
 * Contract shape & builders
 * ========================== */

/** Base parts of a contract independent of path params */
interface BaseContractConfig {
  method: HttpMethod;
  // request body schema (optional)
  body?: z.ZodType;
  // optional headers schema if you want to validate your own header map
  headers?: z.ZodType;
  // optional query-string schema
  search?: z.ZodType;
  // response map is required
  response: ResponseMap;
}

/** Enforce params schema presence/shape based on the path */
type ContractConfigForPath<Path extends string> =
  HasPathParams<Path> extends true
    ? BaseContractConfig & {
        // required and must be EXACTLY the set of params in the path
        params: ParamSchemaFor<Path>;
      }
    : BaseContractConfig & {
        // optional; if present, must be an empty object schema
        params?: EmptyParamsSchema;
      };

/** The fully materialized contract type */
export type Contract<Path extends string> = {
  path: Path;
} & ContractConfigForPath<Path>;

/** Define a contract with strong type constraints */
export function defineContract<
  Path extends string,
  Config extends ContractConfigForPath<Path>,
>(path: Path, config: Config): Config & { path: Path } {
  return { path, ...config };
}
