import { SettingsPage } from '#src/features/settings/SettingsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_layout/settings')({
  component: SettingsPage,
})
