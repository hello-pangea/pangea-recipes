import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';
import { nutritionSchemaRef } from '../../recipes/types/nutrition.js';
import { importedIngredientSchema } from './importedIngredient.js';

const importedRecipeSchemaId = 'ImportedRecipe';

export type ImportedRecipe = Static<typeof importedRecipeSchema>;
export const importedRecipeSchema = Type.Object(
  {
    name: Type.String(),

    description: Nullable(Type.String()),

    /** Seconds */
    prepTime: Nullable(Type.Number({ description: 'Seconds' })),
    /** Seconds */
    cookTime: Nullable(Type.Number({ description: 'Seconds' })),
    /** Seconds */
    totalTime: Nullable(Type.Number({ description: 'Seconds' })),

    servings: Nullable(Type.Number()),

    ingredientGroups: Type.Array(
      Type.Object({
        name: Type.String(),
        ingredients: Type.Array(importedIngredientSchema),
      }),
    ),

    instructionGroups: Type.Array(
      Type.Object({
        name: Type.String(),
        instructions: Type.Array(Type.String()),
      }),
    ),

    nutrition: Nullable(nutritionSchemaRef),
  },
  { $id: importedRecipeSchemaId },
);

export const importedRecipeSchemaRef = Type.Unsafe<ImportedRecipe>(
  Type.Ref(importedRecipeSchemaId),
);
