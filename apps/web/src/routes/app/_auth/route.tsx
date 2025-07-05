import { Layout } from '#src/features/layout/Layout';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth')({
  beforeLoad: ({ context, location, matches }) => {
    if (!context.userId) {
      const lastMatch = matches.at(-1);

      if (lastMatch?.routeId === '/app/_auth/recipes/$recipeId') {
        throw redirect({
          to: '/app/shared-recipes/$recipeId',
          params: {
            recipeId: lastMatch.params.recipeId,
          },
          replace: true,
        });
      }

      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      });
    }

    return {
      userId: context.userId,
    };
  },
  component: Layout,
});
