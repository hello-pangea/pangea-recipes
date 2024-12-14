import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';
import { unitSchema } from '../../units/index.js';
import { createRecipeDtoScema } from './createRecipeDto.js';

export type UpdateRecipeDto = Static<typeof updateRecipeDtoScema>;
export const updateRecipeDtoScema = Type.Partial(
  Type.Composite([
    Type.Pick(createRecipeDtoScema, [
      'name',
      'description',
      'prepTime',
      'cookTime',
      'usesRecipes',
      'tags',
    ]),
    Type.Object({
      ingredientGroups: Type.Array(
        Type.Object({
          id: Type.Optional(Type.String({ format: 'uuid' })),
          name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
          ingredients: Type.Array(
            Type.Object({
              id: Type.Optional(Type.String({ format: 'uuid' })),
              name: Type.String({ minLength: 1 }),
              unit: Type.Optional(Type.Union([unitSchema, Type.Null()])),
              amount: Type.Optional(Nullable(Type.Number())),
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
