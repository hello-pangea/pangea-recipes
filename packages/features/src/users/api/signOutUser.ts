import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';

export function signOutUser() {
  return api
    .post(`users/sign-out`, { credentials: 'include' })
    .then(() => null);
}

interface Options {
  mutationConfig?: MutationConfig<typeof signOutUser>;
}

export function useSignOutUser({ mutationConfig }: Options = {}) {
  return useMutation({
    ...mutationConfig,
    mutationFn: signOutUser,
  });
}
