import { getSignedInUserQueryOptions } from '@open-zero/features/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { authClient } from './authClient';

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    onSuccess: async () => {
      await queryClient.resetQueries({
        queryKey: getSignedInUserQueryOptions().queryKey,
      });
      await router.invalidate();

      if ('gtag' in window) {
        window.gtag('event', 'login');
      }
    },
    mutationFn: (data: Parameters<typeof authClient.signIn.email>[0]) => {
      return authClient.signIn.email(data, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
    },
  });
}
