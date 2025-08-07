import { z } from 'zod/v4';

export const canonicalIngredientSchema = z
  .object({
    id: z.uuidv4(),

    createdAt: z.coerce.date(),

    name: z.string(),

    icon: z
      .object({
        id: z.uuidv4(),
        url: z.url(),
      })
      .optional(),

    aliases: z.array(z.string()),
  })
  .meta({
    id: 'CanonicalIngredient',
  });

export type CanonicalIngredient = z.infer<typeof canonicalIngredientSchema>;
