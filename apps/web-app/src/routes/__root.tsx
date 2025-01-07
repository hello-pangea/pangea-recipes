import { NotFoundPage } from '#src/components/NotFoundPage';
import { config } from '#src/config/config';
import { useUser } from '@clerk/clerk-react';
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
  auth: {
    isLoaded: ReturnType<typeof useUser>['isLoaded'];
    isSignedIn: ReturnType<typeof useUser>['isSignedIn'];
    clerkUser: ReturnType<typeof useUser>['user'];
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  );
}
