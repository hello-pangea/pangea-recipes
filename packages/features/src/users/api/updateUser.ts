import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { userSchema } from '../types/user.js';
import { getSignedInUserQueryOptions } from './getSignedInUser.js';

export const updateUserContract = defineContract('users/:id', {
  method: 'patch',
  params: z.object({
    id: z.uuidv4(),
  }),
  body: userSchema
    .pick({
      themePreference: true,
      unitsPreference: true,
      accentColor: true,
      name: true,
    })
    .partial(),
  response: {
    200: z.object({
      user: userSchema,
    }),
  },
});

const updateUser = makeRequest(updateUserContract, {
  select: (res) => res.user,
});

interface Options {
  mutationConfig?: MutationConfig<typeof updateUser>;
}

export function useUpdateUser({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, onMutate, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getSignedInUserQueryOptions().queryKey,
      });

      void onSuccess?.(...args);
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        getSignedInUserQueryOptions().queryKey,
        (oldUser) => {
          if (!oldUser) {
            return;
          }

          return { ...oldUser, ...variables };
        },
      );

      void onMutate?.(variables);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
}
