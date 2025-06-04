import { CreateRecipePage } from '#src/features/recipes/edit-recipe/CreateRecipePage';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4';

const searchSchema = z.object({
  importFromUrl: z.boolean().optional(),
});

export const Route = createFileRoute('/app/_auth/recipes/new')({
  validateSearch: searchSchema,
  component: CreateRecipePage,
});
