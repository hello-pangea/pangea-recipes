import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { recipeBookRequestSchema } from '../types/recipeBookRequest.js';

export const listRecipeBookRequestsContract = defineContract(
  'recipe-book-requests',
  {
    method: 'get',
    querystring: z.object({
      userId: z.uuidv4(),
      recipeBookId: z.uuidv4(),
    }),
    response: {
      200: z.object({
        recipeBookRequests: recipeBookRequestSchema.array(),
      }),
    },
  },
);

const listRecipeBookRequests = makeRequest(listRecipeBookRequestsContract, {
  select: (res) => res.recipeBookRequests,
});

export function listRecipeBookRequestsQueryOptions(options: {
  userId: string;
  recipeBookId: string;
}) {
  return queryOptions({
    queryKey: ['recipeBookRequests', options],
    queryFn: () => listRecipeBookRequests({ querystring: options }),
  });
}
