import { useUser } from '@clerk/clerk-react';
import { useSignedInUser } from '@open-zero/features/users';
import { RouterProvider } from '@tanstack/react-router';
import { LoadingPage } from './components/LoadingPage';
import { router } from './main';
import { ThemeProvider } from './providers/ThemeProvider';

export function App() {
  const auth = useUser();
  const { data: user, isPending } = useSignedInUser({
    queryConfig: {
      enabled: auth.isLoaded && auth.isSignedIn,
    },
  });

  if (!auth.isLoaded || isPending) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
