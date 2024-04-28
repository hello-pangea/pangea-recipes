import { Type, type Static, type TSchema } from '@sinclair/typebox';

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Unsafe<Static<T> | null>({
    ...schema,
    nullable: true,
  });
