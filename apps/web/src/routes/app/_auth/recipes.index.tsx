import { RecipesPage } from '#src/features/recipes/RecipesPage';
import { listRecipesQueryOptions } from '@open-zero/features/recipes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth/recipes/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      listRecipesQueryOptions({
        userId: context.userId,
      }),
    );
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
