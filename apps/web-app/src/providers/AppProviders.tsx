import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from './ThemeProvider';

interface Props {
  queryClient: QueryClient;
  children: React.ReactNode;
}

export function AppProviders({ children, queryClient }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
