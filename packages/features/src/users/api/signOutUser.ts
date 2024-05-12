import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';

export function signOutUser() {
  return api
    .post(`users/sign-out`, { credentials: 'include' })
    .then((res) => res.json<undefined>());
}

interface Options {
  config?: MutationConfig<typeof signOutUser>;
}

export function useSignOutUser({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: signOutUser,
  });
}
