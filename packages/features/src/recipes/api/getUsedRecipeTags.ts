import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Tag } from '../../common/tag.js';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';

function getUsedRecipeTags({ userId }: { userId: string }): Promise<Tag[]> {
  return api
    .get(`recipes/used-tags`, {
      searchParams: {
        userId,
      },
    })
    .json<{ tags: Tag[] }>()
    .then((res) => res.tags);
}

export function getUsedRecipeTagsQueryOptions(filter: { userId: string }) {
  return queryOptions({
    queryKey: ['used_recipe_tags', filter],
    queryFn: () => getUsedRecipeTags(filter),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

interface Options {
  userId: string;
  queryConfig?: QueryConfig<typeof getUsedRecipeTagsQueryOptions>;
}

export function useUsedRecipeTags({ userId, queryConfig }: Options) {
  return useQuery({
    ...getUsedRecipeTagsQueryOptions({ userId }),
    ...queryConfig,
  });
}
