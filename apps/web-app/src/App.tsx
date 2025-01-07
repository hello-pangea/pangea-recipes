import { useUser } from '@clerk/clerk-react';
import { getSignedInUserQueryOptions } from '@open-zero/features/users';
import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { LoadingPage } from './components/LoadingPage';
import { router } from './main';

export function App() {
  const auth = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (auth.isSignedIn) {
      void queryClient.invalidateQueries({
        queryKey: getSignedInUserQueryOptions().queryKey,
      });
    }
  }, [auth.isSignedIn]);

  if (!auth.isLoaded) {
    return <LoadingPage />;
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
        },
      }}
    />
  );
}
