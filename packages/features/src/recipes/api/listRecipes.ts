import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { RecipeProjected } from '../types/recipeProjected.js';

function listRecipes(options: { userId?: string; recipeBookId?: string }) {
  return api
    .get(`recipes`, {
      searchParams: {
        ...(options.userId && { userId: options.userId }),
        ...(options.recipeBookId && { recipeBookId: options.recipeBookId }),
      },
    })
    .then((res) => res.json<{ recipes: RecipeProjected[] }>());
}

export function getListRecipesQueryOptions(options: {
  userId?: string;
  recipeBookId?: string;
}) {
  return queryOptions({
    queryKey: ['recipes', options],
    queryFn: () => listRecipes(options),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListRecipesQueryOptions>;
  options: {
    userId?: string;
    recipeBookId?: string;
  };
}

export function useRecipes({ queryConfig, options }: Options) {
  return useQuery({
    ...getListRecipesQueryOptions(options),
    ...queryConfig,
  });
}
