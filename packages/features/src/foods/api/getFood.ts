import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Food } from '../types/food.js';

function getFood(foodId: string) {
  return api.get(`foods/${foodId}`).then((res) => res.json<{ food: Food }>());
}

export function getFoodQueryOptions(foodId: string) {
  return queryOptions({
    queryKey: ['foods', foodId],
    queryFn: () => getFood(foodId),
  });
}

interface Options {
  foodId: string;
  queryConfig?: QueryConfig<typeof getFoodQueryOptions>;
}

export function useFood({ foodId, queryConfig }: Options) {
  return useQuery({
    ...getFoodQueryOptions(foodId),
    ...queryConfig,
  });
}
