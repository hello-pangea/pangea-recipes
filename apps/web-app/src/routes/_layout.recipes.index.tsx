import { RecipesPage } from '#src/features/recipes/RecipesPage';
import { getListRecipesQueryOptions } from '@open-zero/features/recipes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/recipes/')({
  loader: async ({ context }) => {
    console.log('loader recipes', context);

    if (!context.userId) {
      return;
    }

    await context.queryClient.ensureQueryData(
      getListRecipesQueryOptions({
        userId: context.userId,
      }),
    );
  },
  component: RecipesPage,
});
