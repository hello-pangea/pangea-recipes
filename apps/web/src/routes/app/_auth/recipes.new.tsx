import { CreateRecipePage } from '#src/features/recipes/edit-recipe/CreateRecipePage';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4';

const searchSchema = z.object({
  importFromUrl: z.boolean().optional(),
  tryLater: z.boolean().optional(),
  favorite: z.boolean().optional(),
});

export const Route = createFileRoute('/app/_auth/recipes/new')({
  validateSearch: searchSchema,
  component: CreateRecipePage,
  head: () => ({
    meta: [
      {
        title: 'New recipe',
      },
    ],
  }),
});
