import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import type { SignUpUserDto } from '../types/signUpUserDto.js';
import type { User } from '../types/user.js';

export function signUpUser(data: SignUpUserDto) {
  return api
    .post(`users/sign-up`, { json: data, credentials: 'include' })
    .then((res) => res.json<{ user: User }>());
}

interface Options {
  config?: MutationConfig<typeof signUpUser>;
}

export function useSignUpUser({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: signUpUser,
  });
}
