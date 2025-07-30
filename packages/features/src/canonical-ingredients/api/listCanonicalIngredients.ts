import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import { canonicalIngredientSchema } from '../types/canonicalIngredient.js';

export const listCanonicalIngredientsContract = defineContract(
  'canonical-ingredients',
  {
    method: 'get',
    response: {
      200: z.object({
        canonicalIngredients: z.array(canonicalIngredientSchema),
      }),
    },
  },
);

const listCanonicalIngredients = makeRequest(listCanonicalIngredientsContract, {
  select: (res) => res.canonicalIngredients,
});

export function getListCanonicalIngredientsQueryOptions() {
  return queryOptions({
    queryKey: ['canonicalIngredients'],
    queryFn: () => listCanonicalIngredients(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListCanonicalIngredientsQueryOptions>;
}

export function useCanonicalIngredients({ queryConfig }: Options = {}) {
  return useQuery({
    ...getListCanonicalIngredientsQueryOptions(),
    ...queryConfig,
  });
}
