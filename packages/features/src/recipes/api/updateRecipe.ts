import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { Recipe } from '../types/recipe.js';
import type { UpdateRecipeDto } from '../types/updateRecipeDto.js';

function updateRecipe(data: UpdateRecipeDto & { id: string }) {
  return api
    .patch(`recipes/${data.id}`, { json: data })
    .then((res) => res.json<{ recipe: Recipe }>());
}

interface Options {
  config?: MutationConfig<typeof updateRecipe>;
}

export function useUpdateRecipe({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: updateRecipe,
  });
}
