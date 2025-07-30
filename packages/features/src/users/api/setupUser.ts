import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import { userSchema } from '../types/user.js';
import { getSignedInUserQueryOptions } from './getSignedInUser.js';

export const setupUserContract = defineContract('users/setup', {
  method: 'post',
  response: {
    200: z.object({
      user: userSchema,
    }),
  },
});

const setupUser = makeRequest(setupUserContract, {
  select: (res) => res.user,
});

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
