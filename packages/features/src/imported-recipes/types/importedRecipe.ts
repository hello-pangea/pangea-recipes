import { Type, type Static } from '@sinclair/typebox';
import { importedIngredientSchema } from './importedIngredient.js';

const importedRecipeSchemaId = 'ImportedRecipe';

export type ImportedRecipe = Static<typeof importedRecipeSchema>;
export const importedRecipeSchema = Type.Object(
  {
    name: Type.Optional(Type.String()),

    description: Type.Optional(Type.String()),

    instructionGroups: Type.Optional(
      Type.Array(
        Type.Object({
          title: Type.Optional(Type.String()),
          instructions: Type.Array(Type.String()),
        }),
      ),
    ),

    ingredients: Type.Optional(Type.Array(importedIngredientSchema)),
  },
  { $id: importedRecipeSchemaId },
);

export const importedRecipeSchemaRef = Type.Unsafe<ImportedRecipe>(
  Type.Ref(importedRecipeSchemaId),
);
