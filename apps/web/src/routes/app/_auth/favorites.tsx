import { listRecipesQueryOptions } from '@repo/features/recipes';
import { createFileRoute } from '@tanstack/react-router';
import { FavoritesPage } from '#src/features/recipes/FavoritesPage';

export const Route = createFileRoute('/app/_auth/favorites')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      listRecipesQueryOptions({
        userId: context.userId,
      }),
    );
  },
  component: FavoritesPage,
  head: () => ({
    meta: [
      {
        title: 'Favorites - Pangea Recipes',
      },
    ],
  }),
});
