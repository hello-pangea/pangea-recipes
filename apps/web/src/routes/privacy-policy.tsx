import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPolicyPage } from '#src/features/legal/PrivacyPolicyPage';

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
});
