import { createLazyFileRoute } from '@tanstack/react-router';
import { HomePage } from '#src/features/marketing/HomePage';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});
