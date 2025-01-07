import { SignInPage } from '#src/features/auth/SignInPage';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-in/$')({
  validateSearch: (search) => {
    const res = Value.Parse(
      Type.Object({ redirect: Type.Optional(Type.String()) }),
      search,
    );

    return res;
  },
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
  component: SignInPage,
});
