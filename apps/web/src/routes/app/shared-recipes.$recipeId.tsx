import { SharedRecipePage } from '#src/features/recipes/SharedRecipePage';
import { seo } from '#src/utils/seo';
import { getRecipeQueryOptions } from '@open-zero/features/recipes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/shared-recipes/$recipeId')({
  loader: ({ context: { queryClient }, params: { recipeId } }) => {
    return queryClient.ensureQueryData(getRecipeQueryOptions(recipeId));
  },
  component: SharedRecipePage,
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: loaderData?.name ?? 'Recipe',
        description: `Never forget another recipe. Modern recipe manager to organize and share recipes online.`,
        image: '/assets/og-image.png',
      }),
    ],
  }),
});
