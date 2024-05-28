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
  mutationConfig?: MutationConfig<typeof signUpUser>;
}

export function useSignUpUser({ mutationConfig }: Options = {}) {
  return useMutation({
    ...mutationConfig,
    mutationFn: signUpUser,
  });
}
