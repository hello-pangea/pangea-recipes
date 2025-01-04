import { createFileRoute } from '@tanstack/react-router';
import { CreateRecipeBookPage } from '../features/recipe-books/CreateRecipeBookPage';

export const Route = createFileRoute('/_layout/recipe-books/new')({
  component: CreateRecipeBookPage,
});
