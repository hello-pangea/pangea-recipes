import { NotFoundPage } from '#src/components/NotFoundPage';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

interface RouterContext {
  queryClient: QueryClient;
  userId: string | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <title>Hello Recipes</title>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
