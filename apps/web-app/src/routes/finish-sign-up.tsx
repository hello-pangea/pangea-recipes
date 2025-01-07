import { FinishSignUpPage } from '#src/features/auth/FinishSignUpPage';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/finish-sign-up')({
  beforeLoad: ({ context, location }) => {
    if (
      context.auth.isLoaded &&
      context.auth.isSignedIn &&
      context.auth.clerkUser?.publicMetadata.helloRecipesUserId
    ) {
      throw redirect({
        to: '/recipes',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: FinishSignUpPage,
});
