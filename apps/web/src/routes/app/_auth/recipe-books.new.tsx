import { CreateRecipeBookPage } from '#src/features/recipe-books/CreateRecipeBookPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth/recipe-books/new')({
  component: CreateRecipeBookPage,
});
