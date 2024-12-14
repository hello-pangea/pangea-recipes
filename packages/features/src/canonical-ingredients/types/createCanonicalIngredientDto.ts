import { Type, type Static } from '@sinclair/typebox';

export type CreateCanonicalIngredientDto = Static<
  typeof createCanonicalIngredientDtoScema
>;
export const createCanonicalIngredientDtoScema = Type.Object({
  name: Type.String({ minLength: 1 }),
  iconId: Type.Optional(Type.String({ format: 'uuid' })),
});
