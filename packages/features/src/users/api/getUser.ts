import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import { userSchema } from '../types/user.ts';

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

export function getUserQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser({ params: { id: userId } }),
  });
}
