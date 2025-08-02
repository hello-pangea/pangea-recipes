import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import { publicProfileSchema } from '../types/publicProfile.js';

export const getPublicProfileContract = defineContract('profiles/:id', {
  method: 'get',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: z.object({
      profile: publicProfileSchema,
    }),
  },
});

const getPublicProfile = makeRequest(getPublicProfileContract, {
  select: (res) => res.profile,
});

function getPublicProfileQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['profiles', id],
    queryFn: () => getPublicProfile({ params: { id } }),
  });
}

interface Options {
  id: string;
  queryConfig?: QueryConfig<typeof getPublicProfileQueryOptions>;
}

export function usePublicProfile({ id, queryConfig }: Options) {
  return useQuery({
    ...getPublicProfileQueryOptions(id),
    ...queryConfig,
  });
}
