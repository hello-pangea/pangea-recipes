import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import { userSchema } from '../types/user.js';

export const getUserContract = defineContract('users/:id', {
  method: 'get',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: z.object({
      user: userSchema,
    }),
  },
});

const getUser = makeRequest(getUserContract, {
  select: (res) => res.user,
});

function getUserQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser({ params: { id: userId } }),
  });
}

interface Options {
  id: string;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
}

export function useUser({ id, queryConfig }: Options) {
  return useQuery({
    ...getUserQueryOptions(id),
    ...queryConfig,
  });
}
