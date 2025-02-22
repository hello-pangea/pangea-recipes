import { SignUpPage } from '#src/features/auth/SignUpPage';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/sign-up')({
  validateSearch: (search) => {
    const res = Value.Parse(
      Type.Object({ redirect: Type.Optional(Type.String()) }),
      search,
    );

    return res;
  },
  beforeLoad: ({ context, search }) => {
    if (context.userId) {
      throw redirect({ to: search.redirect || '/app/recipes' });
    }
  },
  component: SignUpPage,
});
