import { ResetPasswordPage } from '#src/features/auth/ResetPasswordPage';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod/v4';

const searchSchema = z.object({
  token: z.string(),
});

export const Route = createFileRoute('/reset-password')({
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => {
    if (context.userId) {
      throw redirect({ to: '/app/recipes' });
    }
  },
  component: ResetPasswordPage,
});
