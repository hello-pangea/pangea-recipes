import { z } from 'zod';
import { nutritionSchema } from '../../recipes/types/nutrition.js';
import { importedIngredientSchema } from './importedIngredient.js';

export const importedRecipeSchema = z
  .object({
    name: z.string(),

    description: z.string().nullable(),

    /** Seconds */
    prepTime: z.number().nullable(),
    /** Seconds */
    cookTime: z.number().nullable(),
    /** Seconds */
    totalTime: z.number().nullable(),

    servings: z.number().nullable(),

    ingredientGroups: z.array(
      z.object({
        name: z.string(),
        ingredients: z.array(importedIngredientSchema),
      }),
    ),

    instructionGroups: z.array(
      z.object({
        name: z.string(),
        instructions: z.array(z.string()),
      }),
    ),

    nutrition: nutritionSchema.nullable(),
  })
  .meta({
    id: 'ImportedRecipe',
  });

export type ImportedRecipe = z.infer<typeof importedRecipeSchema>;
