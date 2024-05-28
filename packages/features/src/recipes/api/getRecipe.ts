import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Recipe } from '../types/recipe.js';

function getRecipe(recipeId: string) {
  return api
    .get(`recipes/${recipeId}`)
    .then((res) => res.json<{ recipe: Recipe }>());
}

function getRecipeQueryOptions(recipeId: string) {
  return queryOptions({
    queryKey: ['recipes', recipeId],
    queryFn: () => getRecipe(recipeId),
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
