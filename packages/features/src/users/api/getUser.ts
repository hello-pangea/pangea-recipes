import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { User } from '../types/user.js';

function getUser(userId: string) {
  return api.get(`users/${userId}`).then((res) => res.json<{ user: User }>());
}

function getUserQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  });
}

interface Options {
  userId: string;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
}

export function useUser({ userId, queryConfig }: Options) {
  return useQuery({
    ...getUserQueryOptions(userId),
    ...queryConfig,
  });
}
