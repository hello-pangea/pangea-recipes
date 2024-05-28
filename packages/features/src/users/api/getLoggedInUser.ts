import { queryOptions, useQuery } from '@tanstack/react-query';
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

function getLoggedInUserQueryOptions() {
  return queryOptions({
    queryKey: [],
    queryFn: () => getLoggedInUser(),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getLoggedInUserQueryOptions>;
}

export function useLoggedInUser({ queryConfig }: Options = {}) {
  return useQuery({
    ...getLoggedInUserQueryOptions(),
    ...queryConfig,
  });
}
