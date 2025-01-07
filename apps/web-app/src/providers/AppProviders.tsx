import { config } from '#src/config/config';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from './ThemeProvider';

interface Props {
  queryClient: QueryClient;
  children: React.ReactNode;
}

export function AppProviders({ children, queryClient }: Props) {
  return (
    <ClerkProvider
      publishableKey={config.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
