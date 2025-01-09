import { PrivacyPolicyPage } from '#src/features/legal/PrivacyPolicyPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
});
