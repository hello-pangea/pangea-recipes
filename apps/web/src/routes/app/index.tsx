import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/')({
  component: () => <Navigate to="/app/recipes" />,
});
