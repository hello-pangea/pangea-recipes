import { RecipesPage } from '#src/features/recipes/RecipesPage';
import { getListRecipesQueryOptions } from '@open-zero/features';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/recipes/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getListRecipesQueryOptions({
        userId: context.auth.user?.id ?? '',
      }),
    );
  },
  component: RecipesPage,
});
