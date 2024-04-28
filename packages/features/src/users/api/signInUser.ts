import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import type { SignInUserDto } from '../types/signInUserDto.js';
import type { User } from '../types/user.js';

export function signInUser(data: SignInUserDto) {
  return api
    .post(`users/sign-in`, { json: data, credentials: 'include' })
    .then((res) => res.json<{ user: User }>());
}

interface Options {
  config?: MutationConfig<typeof signInUser>;
}

export function useSignInUser({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: signInUser,
  });
}
