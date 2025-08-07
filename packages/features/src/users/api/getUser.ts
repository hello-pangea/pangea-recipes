import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
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

export function getUserQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser({ params: { id: userId } }),
  });
}
