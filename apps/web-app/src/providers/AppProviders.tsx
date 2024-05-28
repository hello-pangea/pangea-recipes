import { env } from '#src/config/config';
import { router } from '#src/routes/routes';
import { theme } from '#src/theme/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { setApi } from '@open-zero/features';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';

setApi({ prefixUrl: env.VITE_API_URL });

export function AppProviders() {
  const [queryClient] = useState(() => {
    return new QueryClient();
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </SnackbarProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
