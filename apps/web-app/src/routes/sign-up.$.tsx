import { SignUpPage } from '#src/features/auth/SignUpPage';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-up/$')({
  validateSearch: (search) => {
    const res = Value.Parse(
      Type.Object({ redirect: Type.Optional(Type.String()) }),
      search,
    );

    return res;
  },
  component: SignUpPage,
});
