import { RouterProvider } from '@tanstack/react-router';
import { useAuth } from './features/auth/useAuth';
import { router } from './main';

export function InnerApp() {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return null;
  }

  return (
    <RouterProvider
      router={router}
      defaultPreload="intent"
      context={{ auth }}
    />
  );
}
