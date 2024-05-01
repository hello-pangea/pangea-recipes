import { Type, type Static } from '@sinclair/typebox';

export type ImportedIngredient = Static<typeof importedIngredientSchema>;
export const importedIngredientSchema = Type.Object(
  {
    unit: Type.Optional(Type.String()),
    amount: Type.Optional(Type.Number()),
    name: Type.String(),
  },
  { $id: 'ImportedIngredient' },
);

export const importedIngredientSchemaRef = Type.Ref(importedIngredientSchema);
