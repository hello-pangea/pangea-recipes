import { getRecipeBookQueryOptions } from '@open-zero/features/recipes-books';
import { createFileRoute } from '@tanstack/react-router';
import { RecipeBookPage } from '../features/recipe-books/RecipeBookPage';

export const Route = createFileRoute('/_layout/recipe-books/$recipeBookId')({
  loader: ({ context: { queryClient }, params: { recipeBookId } }) => {
    return queryClient.ensureQueryData(getRecipeBookQueryOptions(recipeBookId));
  },
  component: RecipeBookPage,
});
