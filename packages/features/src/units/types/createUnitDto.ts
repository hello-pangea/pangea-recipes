import { Type, type Static } from '@sinclair/typebox';

export type CreateUnitDto = Static<typeof createUnitDtoSchema>;
export const createUnitDtoSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  pluralName: Type.Optional(Type.String({ minLength: 1 })),
});
