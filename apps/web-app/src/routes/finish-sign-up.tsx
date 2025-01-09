import { FinishSignUpPage } from '#src/features/auth/FinishSignUpPage';
import { SignedIn } from '@clerk/tanstack-start';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/finish-sign-up')({
  component: () => (
    <SignedIn>
      <FinishSignUpPage />
    </SignedIn>
  ),
});
