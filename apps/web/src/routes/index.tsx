import { HomePage } from '#src/features/marketing/HomePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});
