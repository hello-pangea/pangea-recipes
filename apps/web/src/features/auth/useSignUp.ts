import { config } from '#src/config/config';
import { getSignedInUserQueryOptions } from '@repo/features/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { authClient } from './authClient';

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    onSuccess: async () => {
      await queryClient.resetQueries({
        queryKey: getSignedInUserQueryOptions().queryKey,
      });
      await router.invalidate();

      if ('gtag' in window) {
        window.gtag('event', 'sign_up');

        if (config.VITE_GOOGLE_TAG_CONVERSION_DESTINATION) {
          window.gtag('event', 'conversion', {
            send_to: config.VITE_GOOGLE_TAG_CONVERSION_DESTINATION,
          });
        }
      }
    },
    mutationFn: (data: Parameters<typeof authClient.signUp.email>[0]) => {
      return authClient.signUp.email(data, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
    },
  });
}
