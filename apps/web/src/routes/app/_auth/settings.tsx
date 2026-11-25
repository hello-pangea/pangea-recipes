import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '#/features/settings/SettingsPage';

export const Route = createFileRoute('/app/_auth/settings')({
  component: SettingsPage,
});
