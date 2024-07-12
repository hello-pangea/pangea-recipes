import { Type, type Static } from '@sinclair/typebox';
import { createRecipeDtoScema } from './createRecipeDto.js';

export type UpdateRecipeDto = Static<typeof updateRecipeDtoScema>;
export const updateRecipeDtoScema = Type.Partial(
  Type.Pick(createRecipeDtoScema, [
    'name',
    'description',
    'prepTime',
    'cookTime',
    'ingredients',
    'instructionGroups',
    'usesRecipes',
    'tags',
  ]),
);
