import { Layout } from '#src/features/layout/Layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: Layout,
});
