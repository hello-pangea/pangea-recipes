import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';
import { createRecipeDtoScema } from './createRecipeDto.js';

export type UpdateRecipeDto = Static<typeof updateRecipeDtoScema>;
export const updateRecipeDtoScema = Type.Partial(
  Type.Composite([
    Type.Pick(createRecipeDtoScema, [
      'name',
      'description',
      'prepTime',
      'cookTime',
      'servings',
      'usesRecipes',
      'tags',
    ]),
    Type.Object({
      imageIds: Type.Optional(
        Nullable(Type.Array(Type.String({ format: 'uuid' }))),
      ),
      ingredientGroups: Type.Array(
        Type.Object({
          id: Type.Optional(Type.String({ format: 'uuid' })),
          name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
          ingredients: Type.Array(
            Type.Object({
              id: Type.Optional(Type.String({ format: 'uuid' })),
              name: Type.String({ minLength: 1 }),
              unit: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
              quantity: Type.Optional(Nullable(Type.Number())),
              notes: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
            }),
          ),
        }),
      ),
      instructionGroups: Type.Array(
        Type.Object({
          id: Type.Optional(Type.String({ format: 'uuid' })),
          name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
          instructions: Type.Array(
            Type.Object({
              id: Type.Optional(Type.String({ format: 'uuid' })),
              text: Type.String({ minLength: 1 }),
            }),
          ),
        }),
      ),
    }),
  ]),
);
