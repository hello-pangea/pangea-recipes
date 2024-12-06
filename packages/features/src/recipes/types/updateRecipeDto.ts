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
      'ingredients',
      'usesRecipes',
      'tags',
    ]),
    Type.Object({
      instructionGroups: Type.Array(
        Type.Object({
          id: Type.Optional(Type.String({ format: 'uuid' })),
          title: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
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
