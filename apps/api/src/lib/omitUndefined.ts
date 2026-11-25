export type OmitUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
};

/**
 * Removes keys with `undefined` values (shallow). Useful for passing parsed
 * request data with optional fields to Prisma under `exactOptionalPropertyTypes`.
 */
export function omitUndefined<T extends object>(obj: T): OmitUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as OmitUndefined<T>;
}
