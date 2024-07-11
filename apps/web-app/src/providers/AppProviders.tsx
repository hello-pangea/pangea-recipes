import { AuthProvider } from '#src/features/auth/AuthProvider';
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
      <AuthProvider>
        <SnackbarProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
