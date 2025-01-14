import { SignInPage } from '#src/features/auth/SignInPage';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-in/$')({
  validateSearch: (search) => {
    const res = Value.Parse(
      Type.Object({ redirect: Type.Optional(Type.String()) }),
      search,
    );

    return res;
  },
  component: SignInPage,
});
