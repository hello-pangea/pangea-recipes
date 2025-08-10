import { SignUpPage } from '#src/features/auth/SignUpPage';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/sign-up')({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.userId) {
      throw redirect({ to: search.redirect || '/app/recipes' });
    }
  },
  component: SignUpPage,
});
