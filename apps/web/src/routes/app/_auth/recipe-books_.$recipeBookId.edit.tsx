import { EditRecipeBookPage } from '#src/features/recipe-books/EditRecipeBookPage';
import { getRecipeBookQueryOptions } from '@open-zero/features/recipe-books';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/app/_auth/recipe-books_/$recipeBookId/edit',
)({
  loader: ({ context: { queryClient }, params: { recipeBookId } }) => {
    return queryClient.ensureQueryData(getRecipeBookQueryOptions(recipeBookId));
  },
  component: EditRecipeBookPage,
});
