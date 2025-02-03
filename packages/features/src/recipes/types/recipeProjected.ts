import { Type, type Static } from '@sinclair/typebox';
import { recipeSchema } from './recipe.js';

export type RecipeProjected = Static<typeof recipeProjectedSchema>;
export const recipeProjectedSchema = Type.Omit(recipeSchema, [
  'ingredientGroups',
  'instructionGroups',
  'nutrition',
]);
