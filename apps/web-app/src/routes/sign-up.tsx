import { SignUpPage } from '#src/features/auth/SignUpPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
});
