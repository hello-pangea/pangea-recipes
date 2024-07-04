import { AccountPage } from '#src/features/account/AccountPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/account')({
  component: AccountPage,
});
