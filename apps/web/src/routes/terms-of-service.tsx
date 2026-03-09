import { createFileRoute } from '@tanstack/react-router';
import { TermsOfServicePage } from '#src/features/legal/TermsOfServicePage';

export const Route = createFileRoute('/terms-of-service')({
  component: TermsOfServicePage,
});
