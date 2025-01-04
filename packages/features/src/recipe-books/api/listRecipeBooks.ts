import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { RecipeBook } from '../types/recipeBook.js';

function listRecipeBooks(options: { userId: string }) {
  return api
    .get(`recipe-books`, {
      searchParams: {
        userId: options.userId,
      },
    })
    .then((res) => res.json<{ recipeBooks: RecipeBook[] }>());
}

export function getListRecipeBooksQueryOptions(options: { userId: string }) {
  return queryOptions({
    queryKey: ['recipeBooks'],
    queryFn: () => listRecipeBooks(options),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListRecipeBooksQueryOptions>;
  options: {
    userId: string;
  };
}

export function useRecipeBooks({ queryConfig, options }: Options) {
  return useQuery({
    ...getListRecipeBooksQueryOptions(options),
    ...queryConfig,
  });
}
