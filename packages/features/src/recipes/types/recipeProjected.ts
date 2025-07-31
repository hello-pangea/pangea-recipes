import { z } from 'zod/v4';
import { recipeSchema } from './recipe.js';

export const recipeProjectedSchema = recipeSchema.omit({
  ingredientGroups: true,
  instructionGroups: true,
  nutrition: true,
});

export type RecipeProjected = z.infer<typeof recipeProjectedSchema>;
