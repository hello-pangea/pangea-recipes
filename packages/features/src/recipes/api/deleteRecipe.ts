import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeQueryOptions } from './getRecipe.js';
import { listRecipesQueryOptions } from './listRecipes.js';

export const deleteRecipeContract = defineContract('recipes/:id', {
  method: 'delete',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: noContent,
  },
});

const deleteRecipe = makeRequest(deleteRecipeContract);

interface Options {
  mutationConfig?: MutationConfig<typeof deleteRecipe>;
}

export function useDeleteRecipe({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, onMutate, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onMutate: (args) => {
      const recipe = queryClient.getQueryData(
        getRecipeQueryOptions(args.params.id).queryKey,
      );

      if (recipe) {
        queryClient.setQueryData(
          listRecipesQueryOptions({
            userId: recipe.userId,
          }).queryKey,
          (oldRecipes) => {
            return oldRecipes?.filter((r) => r.id !== args.params.id) ?? [];
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
