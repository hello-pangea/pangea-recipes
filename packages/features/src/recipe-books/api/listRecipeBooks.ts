import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import { recipeBookSchema } from '../types/recipeBook.ts';

export const listRecipeBooksContract = defineContract('recipe-books', {
  method: 'get',
  querystring: z.object({
    userId: z.uuidv4(),
  }),
  response: {
    200: z.object({
      recipeBooks: recipeBookSchema.array(),
    }),
  },
});

const listRecipeBooks = makeRequest(listRecipeBooksContract, {
  select: (res) => res.recipeBooks,
});

export function listRecipeBooksQueryOptions(options: { userId: string }) {
  return queryOptions({
    queryKey: ['recipeBooks', options],
    queryFn: () => listRecipeBooks({ querystring: options }),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
