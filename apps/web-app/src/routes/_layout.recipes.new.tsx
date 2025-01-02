import { CreateRecipePage } from '#src/features/recipes/edit-recipe/CreateRecipePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/recipes/new')({
  component: CreateRecipePage,
});
