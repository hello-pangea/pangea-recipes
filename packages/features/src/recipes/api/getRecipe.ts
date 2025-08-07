import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
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
