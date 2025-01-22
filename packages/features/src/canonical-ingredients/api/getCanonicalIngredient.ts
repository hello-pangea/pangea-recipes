import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { CanonicalIngredient } from '../types/canonicalIngredient.js';

function getCanonicalIngredient(
  canonicalIngredientId: string,
): Promise<CanonicalIngredient> {
  return api
    .get(`canonical-ingredients/${canonicalIngredientId}`)
    .json<{ canonicalIngredient: CanonicalIngredient }>()
    .then((res) => res.canonicalIngredient);
}

export function getCanonicalIngredientQueryOptions(
  canonicalIngredientId: string,
) {
  return queryOptions({
    queryKey: ['canonicalIngredients', canonicalIngredientId],
    queryFn: () => getCanonicalIngredient(canonicalIngredientId),
  });
}

interface Options {
  canonicalIngredientId: string;
  queryConfig?: QueryConfig<typeof getCanonicalIngredientQueryOptions>;
}

export function useCanonicalIngredient({
  canonicalIngredientId,
  queryConfig,
}: Options) {
  return useQuery({
    ...getCanonicalIngredientQueryOptions(canonicalIngredientId),
    ...queryConfig,
  });
}
