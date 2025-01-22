import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';
import { importedIngredientSchema } from './importedIngredient.js';

const importedRecipeSchemaId = 'ImportedRecipe';

export type ImportedRecipe = Static<typeof importedRecipeSchema>;
export const importedRecipeSchema = Type.Object(
  {
    name: Nullable(Type.String()),

    description: Nullable(Type.String()),

    /** Minutes */
    prepTime: Nullable(Type.Number({ description: 'Minutes' })),
    /** Minutes */
    cookTime: Nullable(Type.Number({ description: 'Minutes' })),
    /** Minutes */
    totalTime: Nullable(Type.Number({ description: 'Minutes' })),

    servings: Nullable(Type.Number()),

    ingredientGroups: Nullable(
      Type.Array(
        Type.Object({
          title: Nullable(Type.String()),
          ingredients: Type.Array(importedIngredientSchema),
        }),
      ),
    ),

    instructionGroups: Nullable(
      Type.Array(
        Type.Object({
          title: Nullable(Type.String()),
          instructions: Type.Array(Type.String()),
        }),
      ),
    ),
  },
  { $id: importedRecipeSchemaId },
);

export const importedRecipeSchemaRef = Type.Unsafe<ImportedRecipe>(
  Type.Ref(importedRecipeSchemaId),
);
