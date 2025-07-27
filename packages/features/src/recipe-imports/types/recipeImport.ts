import { z } from 'zod/v4';

export const recipeImportSchema = z
  .object({
    id: z.uuidv4(),
    createdAt: z.coerce.date(),
    userId: z.uuidv4(),
    url: z.uuidv4(),
    error: z.string().nullable(),
    status: z.enum(['parsing', 'complete', 'failed']),
  })
  .meta({
    id: 'RecipeImport',
  });

export type RecipeImport = z.infer<typeof recipeImportSchema>;
