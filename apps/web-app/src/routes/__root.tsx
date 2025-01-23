import { NotFoundPage } from '#src/components/NotFoundPage';
import { config } from '#src/config/config';
import { ClerkLoaded, ClerkProvider } from '@clerk/tanstack-start';
import { dark } from '@clerk/themes';
import { useColorScheme } from '@mui/material';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const TanStackRouterDevtools = config.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

interface RouterContext {
  queryClient: QueryClient;
  userId: string | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  beforeLoad: () => {
    return {
      userId: window.Clerk?.user?.publicMetadata.helloRecipesUserId ?? null,
    };
  },
});

function RootComponent() {
  const { colorScheme } = useColorScheme();

  return (
    <ClerkProvider
      publishableKey={config.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/app/sign-in"
      signUpUrl="/app/sign-up"
      signInUrl="/app/sign-in"
      signInFallbackRedirectUrl={'/app/recipes'}
      signUpForceRedirectUrl={'/app/finish-sign-up'}
      appearance={{
        baseTheme: colorScheme === 'dark' ? dark : undefined,
      }}
    >
      <ClerkLoaded>
        <Outlet />
        <ReactQueryDevtools buttonPosition="top-right" />
        <Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
