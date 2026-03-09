import { getRecipeQueryOptions } from '@repo/features/recipes';
import { createFileRoute } from '@tanstack/react-router';
import { RecipePage } from '#src/features/recipes/RecipePage';

export const Route = createFileRoute('/app/_auth/recipes/$recipeId')({
  loader: ({ context: { queryClient }, params: { recipeId } }) => {
    return queryClient.ensureQueryData(getRecipeQueryOptions(recipeId));
  },
  component: RecipePage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.name || 'Recipe',
      },
    ],
  }),
});
