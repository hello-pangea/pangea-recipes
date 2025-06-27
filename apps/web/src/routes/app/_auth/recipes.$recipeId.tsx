import { RecipePage } from '#src/features/recipes/RecipePage';
import { getRecipeQueryOptions } from '@open-zero/features/recipes';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth/recipes/$recipeId')({
  beforeLoad: ({ context: { userId }, params: { recipeId } }) => {
    if (!userId) {
      throw redirect({
        to: '/app/shared-recipes/$recipeId',
        params: {
          recipeId,
        },
        replace: true,
      });
    }
  },
  loader: ({ context: { queryClient }, params: { recipeId } }) => {
    return queryClient.ensureQueryData(getRecipeQueryOptions(recipeId));
  },
  component: RecipePage,
});
