import { Type, type Static } from '@sinclair/typebox';
import { importedIngredientSchema } from './importedIngredient.js';

export type ImportedRecipe = Static<typeof importedRecipeSchema>;
export const importedRecipeSchema = Type.Object(
  {
    name: Type.Optional(Type.String()),

    description: Type.Optional(Type.String()),

    instructions: Type.Optional(Type.Array(Type.String())),

    ingredients: Type.Optional(
      Type.Array(Type.Union([Type.String(), importedIngredientSchema])),
    ),
  },
  { $id: 'ImportedRecipe' },
);

export const importedRecipeSchemaRef = Type.Ref(importedRecipeSchema);
