import { z } from 'zod';

export const recipeImportSchema = z
  .object({
    id: z.uuidv4(),
    createdAt: z.coerce.date(),
    userId: z.uuidv4(),
    url: z.url(),
    error: z.string().nullable(),
    status: z.enum(['parsing', 'complete', 'failed']),
  })
  .meta({
    id: 'RecipeImport',
  });

export type RecipeImport = z.infer<typeof recipeImportSchema>;
