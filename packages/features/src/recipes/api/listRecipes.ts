import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { RecipeProjected } from '../types/recipeProjected.js';

function listRecipes() {
  return api
    .get(`recipes`)
    .then((res) => res.json<{ recipes: RecipeProjected[] }>());
}

export function getListRecipesQueryOptions() {
  return queryOptions({
    queryKey: ['recipes'],
    queryFn: () => listRecipes(),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListRecipesQueryOptions>;
}

export function useRecipes({ queryConfig }: Options = {}) {
  return useQuery({
    ...getListRecipesQueryOptions(),
    ...queryConfig,
  });
}
