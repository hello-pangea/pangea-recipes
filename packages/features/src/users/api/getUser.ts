import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { User } from '../types/user.js';

function getUser(userId: string) {
  return api.get(`users/${userId}`).then((res) => res.json<{ user: User }>());
}

interface Options {
  userId: string;
  config?: QueryConfig<typeof getUser>;
}

export function useUser({ userId, config }: Options) {
  return useQuery({
    ...config,
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  });
}
