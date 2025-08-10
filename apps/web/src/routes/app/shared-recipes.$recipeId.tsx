import { SharedRecipePage } from '#src/features/recipes/SharedRecipePage';
import { seo } from '#src/utils/seo';
import { getRecipeQueryOptions } from '@repo/features/recipes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/shared-recipes/$recipeId')({
  loader: async ({ context: { queryClient }, params: { recipeId } }) => {
    const recipe = await queryClient.ensureQueryData(
      getRecipeQueryOptions(recipeId),
    );

    return {
      recipe,
    };
  },
  component: SharedRecipePage,
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: loaderData?.recipe.name ?? 'Recipe',
      }),
    ],
  }),
});
