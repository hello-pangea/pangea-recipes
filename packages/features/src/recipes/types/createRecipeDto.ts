import { Type, type Static } from '@sinclair/typebox';

export type CreateRecipeDto = Static<typeof createRecipeDtoScema>;
export const createRecipeDtoScema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String({ minLength: 1 })),
  prepTime: Type.Optional(Type.Number()),
  cookTime: Type.Optional(Type.Number()),
  ingredients: Type.Array(
    Type.Object({
      ingredientId: Type.String({ format: 'uuid' }),
      unitId: Type.String({ format: 'uuid' }),
      amount: Type.Number(),
      notes: Type.Optional(Type.String({ minLength: 1 })),
    }),
  ),
  instructions: Type.Array(Type.String()),
  usesRecipes: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
});
