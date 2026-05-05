import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.ts';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import { type MutationConfig } from '../../lib/tanstackQuery.ts';
import { getRecipeQueryOptions } from './getRecipe.ts';
import { listRecipesQueryOptions } from './listRecipes.ts';

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
    onMutate: (...args) => {
      const input = args[0];
      const recipe = queryClient.getQueryData(getRecipeQueryOptions(input.params.id).queryKey);

      if (recipe) {
        queryClient.setQueryData(
          listRecipesQueryOptions({
            userId: recipe.userId,
          }).queryKey,
          (oldRecipes) => {
            return oldRecipes?.filter((r) => r.id !== input.params.id) ?? [];
          },
        );
      }

      onMutate?.(...args);
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
