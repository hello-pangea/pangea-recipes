import { z } from 'zod';
import { recipeSchema } from './recipe.ts';

export const recipeProjectedSchema = recipeSchema.omit({
  ingredientGroups: true,
  instructionGroups: true,
  nutrition: true,
});

export type RecipeProjected = z.infer<typeof recipeProjectedSchema>;
