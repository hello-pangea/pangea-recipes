import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { PublicProfile } from '../types/publicProfile.js';

function getPublicProfile(userId: string): Promise<PublicProfile> {
  return api
    .get(`profiles/${userId}`)
    .then((res) => res.json<{ profile: PublicProfile }>())
    .then((res) => res.profile);
}

function getPublicProfileQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['profiles', userId],
    queryFn: () => getPublicProfile(userId),
  });
}

interface Options {
  userId: string;
  queryConfig?: QueryConfig<typeof getPublicProfileQueryOptions>;
}

export function usePublicProfile({ userId, queryConfig }: Options) {
  return useQuery({
    ...getPublicProfileQueryOptions(userId),
    ...queryConfig,
  });
}
