import { listRecipesQueryOptions } from '@repo/features/recipes';
import { createFileRoute } from '@tanstack/react-router';
import { RecipesPage } from '#src/features/recipes/RecipesPage';

export const Route = createFileRoute('/app/_auth/recipes/')({
  loader: async ({ context }) => {
    await context.queryClient.query({
      ...listRecipesQueryOptions({
        userId: context.userId,
      }),
      staleTime: 'static',
    });
  },
  component: RecipesPage,
  head: () => ({
    meta: [
      {
        title: 'My recipes - Pangea Recipes',
      },
    ],
  }),
});
