import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
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

interface Options {
  queryConfig?: QueryConfig<typeof listRecipesQueryOptions>;
  options: {
    userId?: string;
    recipeBookId?: string;
  };
}

export function useRecipes({ queryConfig, options }: Options) {
  return useQuery({
    ...listRecipesQueryOptions(options),
    ...queryConfig,
  });
}
