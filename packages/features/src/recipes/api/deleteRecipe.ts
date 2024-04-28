import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { queryClient, type MutationConfig } from '../../lib/tanstackQuery.js';
import type { Recipe } from '../types/recipe.js';

export interface DeleteRecipeDTO {
  recipeId: string;
}

function deleteRecipe({ recipeId }: DeleteRecipeDTO) {
  return api
    .delete(`recipes/${recipeId}`)
    .then((res) => res.json<{ recipe: Recipe }>());
}

interface Options {
  config?: MutationConfig<typeof deleteRecipe>;
}

export function useDeleteRecipe({ config }: Options = {}) {
  return useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
    ...config,
    mutationFn: deleteRecipe,
  });
}
