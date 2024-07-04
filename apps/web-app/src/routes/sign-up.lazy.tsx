import { SignUpPage } from '#src/features/auth/SignUpPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/sign-up')({
  component: SignUpPage,
});
