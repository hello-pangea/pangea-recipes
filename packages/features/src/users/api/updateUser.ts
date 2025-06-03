import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { UpdateUserDto } from '../types/updateUserDto.js';
import type { User } from '../types/user.js';
import { getSignedInUserQueryOptions } from './getSignedInUser.js';

function updateUser(data: UpdateUserDto & { id: string }): Promise<User> {
  return api
    .patch(`users/${data.id}`, { json: data })
    .json<{ user: User }>()
    .then((res) => res.user);
}

interface Options {
  mutationConfig?: MutationConfig<typeof updateUser>;
}

export function useUpdateUser({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getSignedInUserQueryOptions().queryKey,
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
}
