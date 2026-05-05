import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import { type MutationConfig } from '../../lib/tanstackQuery.ts';
import { userSchema } from '../types/user.ts';
import { getSignedInUserQueryOptions } from './getSignedInUser.ts';

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

      queryClient.setQueryData(getSignedInUserQueryOptions().queryKey, structuredClone(data));

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: setupUser,
  });
}
