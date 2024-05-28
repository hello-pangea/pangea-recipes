import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Food } from '../types/food.js';

function listFoods() {
  return api.get(`foods`).then((res) => res.json<{ foods: Food[] }>());
}

export function getListFoodsQueryOptions() {
  return queryOptions({
    queryKey: ['foods'],
    queryFn: () => listFoods(),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListFoodsQueryOptions>;
}

export function useFoods({ queryConfig }: Options = {}) {
  return useQuery({
    ...getListFoodsQueryOptions(),
    ...queryConfig,
  });
}
