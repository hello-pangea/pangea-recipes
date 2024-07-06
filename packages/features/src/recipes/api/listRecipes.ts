import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { RecipeProjected } from '../types/recipeProjected.js';

function listRecipes(options: { userId: string }) {
  return api
    .get(`recipes`, {
      searchParams: {
        userId: options.userId,
      },
    })
    .then((res) => res.json<{ recipes: RecipeProjected[] }>());
}

export function getListRecipesQueryOptions(options: { userId: string }) {
  return queryOptions({
    queryKey: ['recipes'],
    queryFn: () => listRecipes(options),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListRecipesQueryOptions>;
  options: {
    userId: string;
  };
}

export function useRecipes({ queryConfig, options }: Options) {
  return useQuery({
    ...getListRecipesQueryOptions(options),
    ...queryConfig,
  });
}
