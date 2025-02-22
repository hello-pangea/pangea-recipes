import { RouterProvider } from '@tanstack/react-router';
import { authClient } from './features/auth/authClient';
import { router } from './main';

export function App() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending || error) {
    return <div>Loading...</div>;
  }

  return (
    <RouterProvider
      router={router}
      defaultPreload="intent"
      context={{
        userId: session?.user.id ?? null,
      }}
    />
  );
}
