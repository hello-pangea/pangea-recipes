import { FavoritesPage } from '#src/features/recipes/FavoritesPage';
import { getListRecipesQueryOptions } from '@open-zero/features/recipes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth/favorites')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getListRecipesQueryOptions({
        userId: context.userId,
      }),
    );
  },
  component: FavoritesPage,
  head: () => ({
    meta: [
      {
        title: 'Favorites - Hello Recipes',
      },
    ],
  }),
});
