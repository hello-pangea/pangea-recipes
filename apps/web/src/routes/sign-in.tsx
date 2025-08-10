import { SignInPage } from '#src/features/auth/SignInPage';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/sign-in')({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.userId) {
      throw redirect({ to: search.redirect || '/app/recipes' });
    }
  },
  component: SignInPage,
});
