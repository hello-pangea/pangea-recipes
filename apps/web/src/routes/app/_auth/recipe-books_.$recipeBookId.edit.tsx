import { getRecipeBookQueryOptions } from '@repo/features/recipe-books';
import { createFileRoute } from '@tanstack/react-router';
import { EditRecipeBookPage } from '#src/features/recipe-books/EditRecipeBookPage';

export const Route = createFileRoute('/app/_auth/recipe-books_/$recipeBookId/edit')({
  loader: ({ context: { queryClient }, params: { recipeBookId } }) => {
    return queryClient.ensureQueryData(getRecipeBookQueryOptions(recipeBookId));
  },
  component: EditRecipeBookPage,
});
