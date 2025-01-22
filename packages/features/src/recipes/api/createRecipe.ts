import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CreateRecipeDto } from '../types/createRecipeDto.js';
import type { Recipe } from '../types/recipe.js';
import { getListRecipesQueryOptions } from './listRecipes.js';

function createRecipe(data: CreateRecipeDto): Promise<Recipe> {
  return api
    .post(`recipes`, { json: data })
    .json<{ recipe: Recipe }>()
    .then((res) => res.recipe);
}

interface Options {
  mutationConfig?: MutationConfig<typeof createRecipe>;
}

export function useCreateRecipe({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getListRecipesQueryOptions({ userId: '' }).queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createRecipe,
  });
}
