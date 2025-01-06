import { useUser } from '@clerk/clerk-react';
import { useSignedInUser } from '@open-zero/features/users';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './main';

export function App() {
  const auth = useUser();
  const { data: user } = useSignedInUser();

  if (!auth.isLoaded) {
    return null;
  }

  return (
    <RouterProvider
      router={router}
      defaultPreload="intent"
      context={{
        auth: {
          clerkUser: auth.user,
          isLoaded: auth.isLoaded,
          isSignedIn: auth.isSignedIn,
          user: user?.user ?? null,
        },
      }}
    />
  );
}
