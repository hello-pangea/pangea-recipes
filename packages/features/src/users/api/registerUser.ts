import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import type { SignUpUserDto } from '../types/signUpUserDto.js';
import type { User } from '../types/user.js';

export function registerUser(data: SignUpUserDto) {
  return api
    .post(`users/register`, { json: data, credentials: 'include' })
    .then((res) => res.json<{ user: User }>());
}

interface Options {
  config?: MutationConfig<typeof registerUser>;
}

export function useRegisterUser({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: registerUser,
  });
}
