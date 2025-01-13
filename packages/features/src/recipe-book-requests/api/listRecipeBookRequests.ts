import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';

function listRecipeBookRequests(options: {
  userId: string;
  recipeBookId: string;
}): Promise<{ userId: string }[]> {
  return api
    .get(`recipe-book-requests`, {
      searchParams: {
        userId: options.userId,
        recipeBookId: options.recipeBookId,
      },
    })
    .json<{ recipeBookRequests: { userId: string }[] }>()
    .then((res) => res.recipeBookRequests);
}

export function getListRecipeBookRequestsQueryOptions(options: {
  userId: string;
  recipeBookId: string;
}) {
  return queryOptions({
    queryKey: ['recipeBookRequests', options],
    queryFn: () => listRecipeBookRequests(options),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListRecipeBookRequestsQueryOptions>;
  options: {
    userId: string;
    recipeBookId: string;
  };
}

export function useRecipeBookRequests({ queryConfig, options }: Options) {
  return useQuery({
    ...getListRecipeBookRequestsQueryOptions(options),
    ...queryConfig,
  });
}
