import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Ingredient } from '../types/ingredient.js';

function listIngredients() {
  return api
    .get(`ingredients`)
    .then((res) => res.json<{ ingredients: Ingredient[] }>());
}

interface Options {
  config?: QueryConfig<typeof listIngredients>;
}

export function useIngredients({ config }: Options = {}) {
  return useQuery({
    ...config,
    queryKey: ['ingredients'],
    queryFn: listIngredients,
  });
}
