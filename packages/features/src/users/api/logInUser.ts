import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import type { SignInUserDto } from '../types/signInUserDto.js';
import type { User } from '../types/user.js';

export function logInUser(data: SignInUserDto) {
  return api
    .post(`users/log-in`, { json: data, credentials: 'include' })
    .then((res) => res.json<{ user: User }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof logInUser>;
}

export function useLogInUser({ mutationConfig }: Options = {}) {
  return useMutation({
    ...mutationConfig,
    mutationFn: logInUser,
  });
}
