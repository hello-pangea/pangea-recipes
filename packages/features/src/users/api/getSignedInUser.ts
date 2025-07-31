import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import { userSchema } from '../types/user.js';

export const getSignedInUserContract = defineContract('users/signed-in-user', {
  method: 'get',
  response: {
    200: z.object({
      user: userSchema.nullable(),
    }),
  },
});

const getSignedInUser = makeRequest(getSignedInUserContract, {
  select: (res) => res.user,
});

export function getSignedInUserQueryOptions() {
  return queryOptions({
    queryKey: ['current_user'],
    queryFn: () => getSignedInUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
