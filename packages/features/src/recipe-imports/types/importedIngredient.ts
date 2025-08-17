import { z } from 'zod';

export const importedIngredientSchema = z
  .object({
    name: z.string(),
    unit: z.string().nullable(),
    quantity: z.number().nullable(),
    notes: z.string().nullable(),
  })
  .meta({
    id: 'ImportedIngredient',
  });

export type ImportedIngredient = z.infer<typeof importedIngredientSchema>;
