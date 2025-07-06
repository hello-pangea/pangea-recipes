import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { CanonicalIngredient } from '../types/canonicalIngredient.js';

function listCanonicalIngredients(): Promise<CanonicalIngredient[]> {
  return api
    .get(`canonical-ingredients`)
    .json<{ canonicalIngredients: CanonicalIngredient[] }>()
    .then((res) => res.canonicalIngredients);
}

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
