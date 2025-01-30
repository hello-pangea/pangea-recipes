import {
  Type,
  type Static,
  type TObject,
  type TSchema,
} from '@sinclair/typebox';

export function Nullable<T extends TSchema>(schema: T) {
  return Type.Unsafe<Static<T> | null>({
    ...schema,
    nullable: true,
  });
}

export function OptionalNullable<T extends TSchema>(TVal: T) {
  return Type.Optional(Nullable(TVal));
}

export function PartialNullable<T extends TObject>(TObj: T) {
  return Type.Mapped(Type.KeyOf(TObj), (K) =>
    OptionalNullable(Type.Index(TObj, K)),
  );
}
