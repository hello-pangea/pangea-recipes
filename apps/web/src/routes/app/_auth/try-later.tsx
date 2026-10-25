import { listRecipesQueryOptions } from '@repo/features/recipes';
import { createFileRoute } from '@tanstack/react-router';
import { TryLaterPage } from '#src/features/recipes/TryLaterPage';

export const Route = createFileRoute('/app/_auth/try-later')({
  loader: async ({ context }) => {
    await context.queryClient.query({
      ...listRecipesQueryOptions({
        userId: context.userId,
      }),
      staleTime: 'static',
    });
  },
  component: TryLaterPage,
  head: () => ({
    meta: [
      {
        title: 'Try later - Pangea Recipes',
      },
    ],
  }),
});
