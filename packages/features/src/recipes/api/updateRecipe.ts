import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { Recipe } from '../types/recipe.js';
import type { UpdateRecipeDto } from '../types/updateRecipeDto.js';
import { getListRecipesQueryOptions } from './listRecipes.js';

function updateRecipe(data: UpdateRecipeDto & { id: string }) {
  return api
    .patch(`recipes/${data.id}`, { json: data })
    .then((res) => res.json<{ recipe: Recipe }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof updateRecipe>;
}

export function useUpdateRecipe({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getListRecipesQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateRecipe,
  });
}
