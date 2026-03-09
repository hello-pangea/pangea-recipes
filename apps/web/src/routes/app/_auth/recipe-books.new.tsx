import { createFileRoute } from '@tanstack/react-router';
import { CreateRecipeBookPage } from '#src/features/recipe-books/CreateRecipeBookPage';

export const Route = createFileRoute('/app/_auth/recipe-books/new')({
  component: CreateRecipeBookPage,
});
