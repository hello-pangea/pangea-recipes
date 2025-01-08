import { SignUpPage } from '#src/features/auth/SignUpPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-up/$')({
  // beforeLoad: ({ context, location }) => {
  //   if (
  //     context.auth.isLoaded &&
  //     context.auth.isSignedIn &&
  //     context.auth.clerkUser?.publicMetadata.helloRecipesUserId
  //   ) {
  //     throw redirect({
  //       to: '/recipes',
  //       search: {
  //         redirect: location.href,
  //       },
  //     });
  //   }
  // },
  component: SignUpPage,
});
