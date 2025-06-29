import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeQueryOptions } from './getRecipe.js';
import { getListRecipesQueryOptions } from './listRecipes.js';

export interface DeleteRecipeDTO {
  recipeId: string;
}

function deleteRecipe({ recipeId }: DeleteRecipeDTO) {
  return api.delete(`recipes/${recipeId}`).then(() => null);
}

interface Options {
  mutationConfig?: MutationConfig<typeof deleteRecipe>;
}

export function useDeleteRecipe({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, onMutate, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onMutate: (args) => {
      const recipe = queryClient.getQueryData(
        getRecipeQueryOptions(args.recipeId).queryKey,
      );

      if (recipe) {
        queryClient.setQueryData(
          getListRecipesQueryOptions({
            userId: recipe.userId,
          }).queryKey,
          (oldRecipes) => {
            return oldRecipes?.filter((r) => r.id !== args.recipeId) ?? [];
          },
        );
      }

      onMutate?.(args);
    },
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['recipes'],
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRecipe,
  });
}
