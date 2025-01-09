import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { RecipeBook } from '../types/recipeBook.js';

function getRecipeBook(recipeBookId: string): Promise<RecipeBook> {
  return api
    .get(`recipe-books/${recipeBookId}`)
    .json<{ recipeBook: RecipeBook }>()
    .then((res) => res.recipeBook);
}

export function getRecipeBookQueryOptions(recipeBookId: string) {
  return queryOptions({
    queryKey: ['recipeBooks', recipeBookId],
    queryFn: () => getRecipeBook(recipeBookId),
  });
}

interface Options {
  recipeBookId: string;
  queryConfig?: QueryConfig<typeof getRecipeBookQueryOptions>;
}

export function useRecipeBook({ recipeBookId, queryConfig }: Options) {
  return useQuery({
    ...getRecipeBookQueryOptions(recipeBookId),
    ...queryConfig,
  });
}
