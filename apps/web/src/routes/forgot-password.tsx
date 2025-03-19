import { ForgotPasswordPage } from '#src/features/auth/ForgotPasswordPage';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/forgot-password')({
  beforeLoad: ({ context }) => {
    if (context.userId) {
      throw redirect({ to: '/app/recipes' });
    }
  },
  component: ForgotPasswordPage,
});
