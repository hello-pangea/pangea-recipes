import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import type { User } from '../types/user.js';
import { getSignedInUserQueryOptions } from './getSignedInUser.js';

export function setupUser() {
  return api
    .post(`users/setup`)
    .json<{ user: User }>()
    .then((res) => res.user);
}

interface Options {
  mutationConfig?: MutationConfig<typeof setupUser>;
}

export function useSetupUser({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      queryClient.setQueryData(
        getSignedInUserQueryOptions().queryKey,
        structuredClone(data),
      );

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: setupUser,
  });
}
