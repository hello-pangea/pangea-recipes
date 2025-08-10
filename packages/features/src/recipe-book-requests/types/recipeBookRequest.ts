import { z } from 'zod';

export const recipeBookRequestSchema = z
  .object({
    id: z.uuidv4(),

    createdAt: z.coerce.date(),

    userId: z.uuidv4(),
    name: z.string().nullable(),
  })
  .meta({
    id: 'RecipeBookRequest',
  });

export type RecipeBookRequest = z.infer<typeof recipeBookRequestSchema>;
