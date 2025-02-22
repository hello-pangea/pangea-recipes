import { ResetPasswordPage } from '#src/features/auth/ResetPasswordPage';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/reset-password')({
  validateSearch: (search) => {
    const res = Value.Parse(Type.Object({ token: Type.String() }), search);

    return res;
  },
  beforeLoad: ({ context }) => {
    if (context.userId) {
      throw redirect({ to: '/app/recipes' });
    }
  },
  component: ResetPasswordPage,
});
