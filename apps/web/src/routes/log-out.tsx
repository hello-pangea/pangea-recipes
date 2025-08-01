import { authClient } from '#src/features/auth/authClient';
import { getSignedInUserQueryOptions } from '@repo/features/users';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/log-out')({
  preload: false,
  loader: async ({ context }) => {
    await authClient.signOut();
    await context.queryClient.resetQueries({
      queryKey: getSignedInUserQueryOptions().queryKey,
    });

    throw redirect({
      to: '/',
    });
  },
});
