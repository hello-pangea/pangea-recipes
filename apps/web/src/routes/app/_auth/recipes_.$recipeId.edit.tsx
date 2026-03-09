import { getRecipeQueryOptions } from '@repo/features/recipes';
import { createFileRoute } from '@tanstack/react-router';
import { EditRecipePage } from '#src/features/recipes/edit-recipe/EditRecipePage';

export const Route = createFileRoute('/app/_auth/recipes_/$recipeId/edit')({
  loader: ({ context: { queryClient }, params: { recipeId } }) => {
    return queryClient.ensureQueryData(getRecipeQueryOptions(recipeId));
  },
  component: EditRecipePage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `Edit ${loaderData?.name ?? 'recipe'}`,
      },
    ],
  }),
});
