import { Layout } from '#src/features/layout/Layout';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.userId) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: Layout,
});
