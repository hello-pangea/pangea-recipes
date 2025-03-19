import { RecipeBooksPage } from '#src/features/recipe-books/RecipeBooksPage';
import { getListRecipeBooksQueryOptions } from '@open-zero/features/recipe-books';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth/recipe-books/')({
  loader: async ({ context }) => {
    if (!context.userId) {
      return;
    }

    await context.queryClient.ensureQueryData(
      getListRecipeBooksQueryOptions({
        userId: context.userId,
      }),
    );
  },
  component: RecipeBooksPage,
});
