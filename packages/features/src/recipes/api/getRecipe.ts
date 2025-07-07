import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Recipe } from '../types/recipe.js';

function getRecipe(recipeId: string): Promise<Recipe> {
  return api
    .get(`recipes/${recipeId}`)
    .json<{ recipe: Recipe }>()
    .then((res) => res.recipe);
}

export function getRecipeQueryOptions(recipeId: string) {
  return queryOptions({
    queryKey: ['recipes', recipeId],
    queryFn: () => getRecipe(recipeId),
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
