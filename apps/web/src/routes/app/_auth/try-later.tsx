import { listRecipesQueryOptions } from '@repo/features/recipes';
import { createFileRoute } from '@tanstack/react-router';
import { TryLaterPage } from '#src/features/recipes/TryLaterPage';

export const Route = createFileRoute('/app/_auth/try-later')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      listRecipesQueryOptions({
        userId: context.userId,
      }),
    );
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
