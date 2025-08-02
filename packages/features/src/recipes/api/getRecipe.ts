import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import { recipeSchema } from '../types/recipe.js';

export const getRecipeContract = defineContract('recipes/:id', {
  method: 'get',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: z.object({
      recipe: recipeSchema,
    }),
  },
});

const getRecipe = makeRequest(getRecipeContract, {
  select: (res) => res.recipe,
});

export function getRecipeQueryOptions(recipeId: string) {
  return queryOptions({
    queryKey: ['recipes', recipeId],
    queryFn: () => getRecipe({ params: { id: recipeId } }),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

interface Options {
  recipeId: string;
  queryConfig?: QueryConfig<typeof getRecipeQueryOptions>;
}

export function useRecipe({ recipeId, queryConfig }: Options) {
  return useQuery({
    ...getRecipeQueryOptions(recipeId),
    ...queryConfig,
  });
}
