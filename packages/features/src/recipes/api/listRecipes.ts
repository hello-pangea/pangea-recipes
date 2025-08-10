import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { recipeProjectedSchema } from '../types/recipeProjected.js';

export const listRecipesContract = defineContract('recipes', {
  method: 'get',
  querystring: z.object({
    userId: z.uuidv4().optional(),
    recipeBookId: z.uuidv4().optional(),
  }),
  response: {
    200: z.object({
      recipes: recipeProjectedSchema.array(),
    }),
  },
});

const listRecipes = makeRequest(listRecipesContract, {
  select: (res) => res.recipes,
});

export function listRecipesQueryOptions(options: {
  userId?: string;
  recipeBookId?: string;
}) {
  return queryOptions({
    queryKey: ['recipes', options],
    queryFn: () => listRecipes({ querystring: options }),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
