import { SignInPage } from '#src/features/auth/SignInPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/sign-in')({
  component: SignInPage,
});
