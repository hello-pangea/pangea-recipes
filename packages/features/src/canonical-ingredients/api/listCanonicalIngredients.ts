import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { CanonicalIngredient } from '../types/canonicalIngredient.js';

function listCanonicalIngredients() {
  return api
    .get(`canonical-ingredients`)
    .then((res) => res.json<{ canonicalIngredients: CanonicalIngredient[] }>());
}

export function getListCanonicalIngredientsQueryOptions() {
  return queryOptions({
    queryKey: ['canonicalIngredients'],
    queryFn: () => listCanonicalIngredients(),
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
