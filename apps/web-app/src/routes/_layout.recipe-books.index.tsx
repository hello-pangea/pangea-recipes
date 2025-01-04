import { RecipeBooksPage } from '#src/features/recipe-books/RecipeBooksPage';
import { getListRecipeBooksQueryOptions } from '@open-zero/features/recipes-books';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/recipe-books/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getListRecipeBooksQueryOptions({
        userId: context.auth.user?.id ?? '',
      }),
    );
  },
  component: RecipeBooksPage,
});
