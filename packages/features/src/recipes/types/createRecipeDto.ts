import { Type, type Static } from '@sinclair/typebox';
import { createTagDtoSchema } from '../../common/tag.js';
import { Nullable } from '../../lib/nullable.js';

export type CreateRecipeDto = Static<typeof createRecipeDtoScema>;
export const createRecipeDtoScema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String({ minLength: 1 })),
  prepTime: Type.Optional(Type.Number()),
  cookTime: Type.Optional(Type.Number()),
  imageIds: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
  ingredientGroups: Type.Array(
    Type.Object({
      name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
      ingredients: Type.Array(
        Type.Object({
          name: Type.String({ minLength: 1 }),
          unit: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
          amount: Type.Optional(Nullable(Type.Number())),
          notes: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
        }),
      ),
    }),
  ),
  instructionGroups: Type.Array(
    Type.Object({
      name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
      instructions: Type.Array(
        Type.Object({
          text: Type.String({ minLength: 1 }),
        }),
      ),
    }),
  ),
  usesRecipes: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
  tags: Type.Optional(
    Type.Array(
      Type.Union([
        Type.Object({ id: Type.String({ format: 'uuid' }) }),
        createTagDtoSchema,
      ]),
    ),
  ),
  websitePageId: Type.Optional(Type.String({ format: 'uuid' })),
});
