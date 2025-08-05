import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { recipeImportSchema } from '../types/recipeImport.js';

export const listRecipeImportsContract = defineContract('recipe-imports', {
  method: 'get',
  querystring: z.object({
    userId: z.uuidv4(),
    status: z.enum(['parsing', 'complete', 'failed']).optional(),
  }),
  response: {
    200: z.object({
      recipeImports: recipeImportSchema.array(),
    }),
  },
});

const listRecipeImports = makeRequest(listRecipeImportsContract, {
  select: (res) => res.recipeImports,
});

export function listRecipeImportsQueryOptions(options: { userId: string }) {
  return queryOptions({
    queryKey: ['recipeImports', options],
    queryFn: () =>
      listRecipeImports({
        querystring: { userId: options.userId, status: 'parsing' },
      }),
  });
}
