import { listRecipeBooksQueryOptions } from '@repo/features/recipe-books';
import { createFileRoute } from '@tanstack/react-router';
import { RecipeBooksPage } from '#src/features/recipe-books/RecipeBooksPage';

export const Route = createFileRoute('/app/_auth/recipe-books/')({
  loader: async ({ context }) => {
    await context.queryClient.query({
      ...listRecipeBooksQueryOptions({
        userId: context.userId,
      }),
      staleTime: 'static',
    });
  },
  component: RecipeBooksPage,
  head: () => ({
    meta: [
      {
        title: 'Books - Pangea Recipes',
      },
    ],
  }),
});
