import { Type, type Static } from '@sinclair/typebox';
import { unitSchema } from '../../units/index.js';

const importedIngredientSchemaId = 'ImportedIngredient';

export type ImportedIngredient = Static<typeof importedIngredientSchema>;
export const importedIngredientSchema = Type.Object(
  {
    name: Type.String(),
    unit: Type.Optional(unitSchema),
    amount: Type.Optional(Type.Number()),
    notes: Type.Optional(Type.String()),
  },
  { $id: importedIngredientSchemaId },
);

export const importedIngredientSchemaRef = Type.Unsafe<ImportedIngredient>(
  Type.Ref(importedIngredientSchemaId),
);
