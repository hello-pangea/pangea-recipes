import { z } from 'zod/v4';
import { recipeBookRequestSchema } from '../../recipe-book-requests/index.js';

export const recipeBookSchema = z
  .object({
    id: z.uuidv4(),
    createdAt: z.date(),
    name: z.string(),
    description: z.string().nullable(),
    access: z.enum(['public', 'private']),
    recipeIds: z.array(z.uuidv4()),
    members: z.array(
      z.object({
        userId: z.uuidv4(),
        name: z.string(),
        role: z.enum(['owner', 'editor', 'viewer']),
      }),
    ),
    invites: z.array(
      z.object({
        inviteeEmail: z.email(),
        role: z.enum(['owner', 'editor', 'viewer']),
      }),
    ),
    requests: z.array(recipeBookRequestSchema),
  })
  .meta({
    id: 'RecipeBook',
  });

export type RecipeBook = z.infer<typeof recipeBookSchema>;
