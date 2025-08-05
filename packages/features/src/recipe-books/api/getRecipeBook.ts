import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { recipeBookSchema } from '../types/recipeBook.js';

export const getRecipeBookContract = defineContract('recipe-books/:id', {
  method: 'get',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: z.object({
      recipeBook: recipeBookSchema,
    }),
  },
});

const getRecipeBook = makeRequest(getRecipeBookContract, {
  select: (res) => res.recipeBook,
});

export function getRecipeBookQueryOptions(recipeBookId: string) {
  return queryOptions({
    queryKey: ['recipeBooks', recipeBookId],
    queryFn: () => getRecipeBook({ params: { id: recipeBookId } }),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
