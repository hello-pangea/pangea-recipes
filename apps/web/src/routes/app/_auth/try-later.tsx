import { TryLaterPage } from '#src/features/recipes/TryLaterPage';
import { getListRecipesQueryOptions } from '@open-zero/features/recipes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth/try-later')({
  loader: async ({ context }) => {
    if (!context.userId) {
      return;
    }

    await context.queryClient.ensureQueryData(
      getListRecipesQueryOptions({
        userId: context.userId,
      }),
    );
  },
  component: TryLaterPage,
});
