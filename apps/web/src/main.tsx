import '#src/theme/theme.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/lora';
import { updateApiOptions } from '@open-zero/features';
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { HTTPError } from 'ky';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { config } from './config/config';
import { AppProviders } from './providers/AppProviders';
import { routeTree } from './routeTree.gen';

updateApiOptions({
  prefixUrl: config.VITE_API_URL,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof HTTPError && error.response.status === 403) {
          return false;
        }

        return failureCount < 3;
      },
    },
  },
});

export const router = createRouter({
  routeTree,
  context: { queryClient, userId: null },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element');
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <Suspense fallback={null}>
        <AppProviders queryClient={queryClient}>
          <App />
        </AppProviders>
      </Suspense>
    </StrictMode>,
  );
}
