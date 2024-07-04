import { theme } from '#src/theme/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

interface Props {
  queryClient: QueryClient;
  children: React.ReactNode;
}

export function AppProviders({ children, queryClient }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
