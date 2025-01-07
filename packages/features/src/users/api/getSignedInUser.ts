import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { User } from '../types/user.js';

export function getSignedInUser() {
  return api
    .get(`users/signed-in-user`, {
      credentials: 'include',
    })
    .json<{ user: User | null }>()
    .then((res) => res.user);
}

export function getSignedInUserQueryOptions() {
  return queryOptions({
    queryKey: ['current_user'],
    queryFn: () => getSignedInUser(),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getSignedInUserQueryOptions>;
}

export function useSignedInUser({ queryConfig }: Options = {}) {
  return useQuery({
    ...getSignedInUserQueryOptions(),
    ...queryConfig,
  });
}
