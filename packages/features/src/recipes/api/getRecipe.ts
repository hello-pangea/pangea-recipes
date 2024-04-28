import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Recipe } from '../types/recipe.js';

function getRecipe(recipeId: string) {
  return api
    .get(`recipes/${recipeId}`)
    .then((res) => res.json<{ recipe: Recipe }>());
}

interface Options {
  recipeId: string;
  config?: QueryConfig<typeof getRecipe>;
}

export function useRecipe({ recipeId, config }: Options) {
  return useQuery({
    ...config,
    queryKey: ['recipes', recipeId],
    queryFn: () => getRecipe(recipeId),
  });
}
