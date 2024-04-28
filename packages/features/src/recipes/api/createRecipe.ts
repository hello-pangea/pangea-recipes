import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CreateRecipeDto } from '../types/createRecipeDto.js';
import type { Recipe } from '../types/recipe.js';

function createRecipe(data: CreateRecipeDto) {
  return api
    .post(`recipes`, { json: data })
    .then((res) => res.json<{ recipe: Recipe }>());
}

interface Options {
  config?: MutationConfig<typeof createRecipe>;
}

export function useCreateRecipe({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: createRecipe,
  });
}
