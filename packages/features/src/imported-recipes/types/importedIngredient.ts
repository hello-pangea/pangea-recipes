import { Type, type Static } from '@sinclair/typebox';
import { unitSchema } from '../../units/index.js';

export type ImportedIngredient = Static<typeof importedIngredientSchema>;
export const importedIngredientSchema = Type.Object(
  {
    name: Type.String(),
    unit: Type.Optional(unitSchema),
    amount: Type.Optional(Type.Number()),
    notes: Type.Optional(Type.String()),
  },
  { $id: 'ImportedIngredient' },
);

export const importedIngredientSchemaRef = Type.Ref(importedIngredientSchema);
