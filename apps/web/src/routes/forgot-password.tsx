import { createFileRoute, redirect } from '@tanstack/react-router';
import { ForgotPasswordPage } from '#src/features/auth/ForgotPasswordPage';

export const Route = createFileRoute('/forgot-password')({
  beforeLoad: ({ context }) => {
    if (context.userId) {
      throw redirect({ to: '/app/recipes' });
    }
  },
  component: ForgotPasswordPage,
});
