import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { RecipeBook } from '../types/recipeBook.js';

function listRecipeBooks(options: { userId: string }): Promise<RecipeBook[]> {
  return api
    .get(`recipe-books`, {
      searchParams: {
        userId: options.userId,
      },
    })
    .json<{ recipeBooks: RecipeBook[] }>()
    .then((res) => res.recipeBooks);
}

export function getListRecipeBooksQueryOptions(options: { userId: string }) {
  return queryOptions({
    queryKey: ['recipeBooks', options],
    queryFn: () => listRecipeBooks(options),
    staleTime: 1000 * 60 * 60, // 1 hour
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
