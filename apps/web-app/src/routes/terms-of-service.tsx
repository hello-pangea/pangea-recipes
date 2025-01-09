import { TermsOfServicePage } from '#src/features/legal/TermsOfServicePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms-of-service')({
  component: TermsOfServicePage,
});
