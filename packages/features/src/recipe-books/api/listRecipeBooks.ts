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
