import '#src/theme/theme.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/merriweather-sans';
import { updateApiOptions } from '@open-zero/features';
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { InnerApp } from './App';
import { config } from './config/config';
import { AppProviders } from './providers/AppProviders';
import { routeTree } from './routeTree.gen';

updateApiOptions({ prefixUrl: config.VITE_API_URL, credentials: 'include' });
const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  context: { queryClient, auth: undefined! },
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
          <InnerApp />
        </AppProviders>
      </Suspense>
    </StrictMode>,
  );
}
