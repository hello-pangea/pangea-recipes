import { RecipePage } from '#src/features/recipes/RecipePage';
import { getRecipeQueryOptions } from '@open-zero/features';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/recipes/$recipeId')({
  loader: ({ context: { queryClient }, params: { recipeId } }) => {
    return queryClient.ensureQueryData(getRecipeQueryOptions(recipeId));
  },
  component: RecipePage,
});
