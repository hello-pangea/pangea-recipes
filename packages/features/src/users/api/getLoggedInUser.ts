import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { User } from '../types/user.js';

export function getLoggedInUser() {
  return api
    .get(`users/user-from-cookie`, {
      credentials: 'include',
    })
    .then((res) => res.json<{ user: User | null }>());
}

interface Options {
  config?: QueryConfig<typeof getLoggedInUser>;
}

export function useLoggedInUser({ config }: Options = {}) {
  return useQuery({
    ...config,
    queryKey: [],
    queryFn: () => getLoggedInUser(),
  });
}
