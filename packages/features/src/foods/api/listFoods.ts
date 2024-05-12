import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Food } from '../types/food.js';

function listFoods() {
  return api.get(`foods`).then((res) => res.json<{ foods: Food[] }>());
}

interface Options {
  config?: QueryConfig<typeof listFoods>;
}

export function useFoods({ config }: Options = {}) {
  return useQuery({
    ...config,
    queryKey: ['foods'],
    queryFn: listFoods,
  });
}
