import { RequestAccessToRecipeBookPage } from '#src/features/recipe-books/RequestAccessToRecipeBookPage';
import { getRecipeBookQueryOptions } from '@open-zero/features/recipe-books';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { HTTPError } from 'ky';
import { RecipeBookPage } from '../features/recipe-books/RecipeBookPage';

export const Route = createFileRoute('/_layout/recipe-books/$recipeBookId')({
  loader: ({ context: { queryClient, userId }, params: { recipeBookId } }) => {
    if (!userId) {
      return;
    }

    return queryClient.ensureQueryData(getRecipeBookQueryOptions(recipeBookId));
  },
  component: RecipeBookPage,
  errorComponent: ({ error }) => {
    if (error instanceof HTTPError) {
      if (error.response.status === 403) {
        return <RequestAccessToRecipeBookPage />;
      }
    }

    return <ErrorComponent error={error} />;
  },
});
