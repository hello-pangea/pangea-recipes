import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { RecipeProjected } from '../types/recipeProjected.js';

function listRecipes() {
  return api
    .get(`recipes`)
    .then((res) => res.json<{ recipes: RecipeProjected[] }>());
}

interface Options {
  config?: QueryConfig<typeof listRecipes>;
}

export function useRecipes({ config }: Options = {}) {
  return useQuery({
    ...config,
    queryKey: ['recipes'],
    queryFn: listRecipes,
  });
}
