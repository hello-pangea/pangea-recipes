import { Type, type Static } from '@sinclair/typebox';
import { createFoodDtoScema } from '../../foods/index.js';
import { Nullable } from '../../lib/nullable.js';

export type CreateRecipeDto = Static<typeof createRecipeDtoScema>;
export const createRecipeDtoScema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String({ minLength: 1 })),
  prepTime: Type.Optional(Type.Number()),
  cookTime: Type.Optional(Type.Number()),
  ingredients: Type.Array(
    Type.Object({
      food: Type.Union([
        Type.Object({
          id: Type.String({ format: 'uuid' }),
        }),
        createFoodDtoScema,
      ]),
      unitId: Type.Optional(Nullable(Type.String({ format: 'uuid' }))),
      amount: Type.Optional(Nullable(Type.Number())),
      notes: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
    }),
  ),
  instructionGroups: Type.Array(
    Type.Object({
      title: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
      instructions: Type.Array(
        Type.Object({
          text: Type.String({ minLength: 1 }),
        }),
      ),
    }),
  ),
  usesRecipes: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
});
