import { RecipesPage } from '#src/features/recipes/RecipesPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/recipes/')({
  component: RecipesPage,
});
