import { updateApiOptions } from '@open-zero/features';
import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { HTTPError } from 'ky';
import { NotFoundPage } from './components/NotFoundPage';
import { config } from './config/config';
import { routeTree } from './routeTree.gen';
import { getServerHeaders } from './utils/getServerHeaders';

export function createRouter() {
  const isBrowser = typeof window !== 'undefined';

  updateApiOptions({
    prefixUrl: config.VITE_API_URL,
    hooks: {
      beforeRequest: [
        async (request) => {
          if (!isBrowser) {
            const headers = await getServerHeaders();

            for (const [key, value] of Object.entries(headers)) {
              if (value !== undefined && typeof value === 'string') {
                request.headers.set(key, value);
              }
            }
          }
        },
      ],
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (
            error instanceof HTTPError &&
            (error.response.status === 403 || error.response.status === 401)
          ) {
            return false;
          }

          return failureCount < 3;
        },
      },
    },
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient, userId: null },
      defaultPreload: 'intent',
      defaultNotFoundComponent: () => <NotFoundPage />,
    }),
    queryClient,
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
