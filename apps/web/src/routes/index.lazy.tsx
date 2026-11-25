import { createLazyFileRoute } from '@tanstack/react-router';
import { HomePage } from '#/features/marketing/HomePage';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});
