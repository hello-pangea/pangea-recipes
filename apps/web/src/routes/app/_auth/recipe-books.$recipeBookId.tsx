import { RecipeBookPage } from '#src/features/recipe-books/RecipeBookPage';
import { RequestAccessToRecipeBookPage } from '#src/features/recipe-books/RequestAccessToRecipeBookPage';
import { getRecipeBookQueryOptions } from '@open-zero/features/recipe-books';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { HTTPError } from 'ky';

export const Route = createFileRoute('/app/_auth/recipe-books/$recipeBookId')({
  loader: ({ context: { queryClient }, params: { recipeBookId } }) => {
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
