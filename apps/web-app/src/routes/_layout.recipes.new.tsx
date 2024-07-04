import { CreateRecipePage } from '#src/features/recipes/CreateRecipePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/recipes/new')({
  component: CreateRecipePage,
});
