import { router } from '#src/routes/routes';
import { theme } from '#src/theme/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { queryClient } from '@open-zero/features';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { RouterProvider } from 'react-router-dom';

export function AppProviders() {
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
