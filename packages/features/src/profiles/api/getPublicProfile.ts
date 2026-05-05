import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import { publicProfileSchema } from '../types/publicProfile.ts';

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

export function getPublicProfileQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['profiles', id],
    queryFn: () => getPublicProfile({ params: { id } }),
  });
}
