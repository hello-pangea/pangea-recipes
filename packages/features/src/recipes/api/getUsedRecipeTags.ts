import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { tagSchema } from '../../common/tag.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';

export const getUsedRecipeTagsContract = defineContract('recipes/used-tags', {
  method: 'get',
  querystring: z.object({
    userId: z.uuidv4().optional(),
  }),
  response: {
    200: z.object({
      tags: tagSchema.array(),
    }),
  },
});

const getUsedRecipeTags = makeRequest(getUsedRecipeTagsContract, {
  select: (res) => res.tags,
});

export function getUsedRecipeTagsQueryOptions(filter: { userId: string }) {
  return queryOptions({
    queryKey: ['used_recipe_tags', filter],
    queryFn: () => getUsedRecipeTags({ querystring: filter }),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
