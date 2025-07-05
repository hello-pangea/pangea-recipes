import { getSignedInUserQueryOptions } from '@open-zero/features/users';
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
