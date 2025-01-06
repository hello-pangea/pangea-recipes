import { Layout } from '#src/features/layout/Layout';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isLoaded && !context.auth.isSignedIn) {
      throw redirect({
        to: '/sign-in/$',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Layout,
});
