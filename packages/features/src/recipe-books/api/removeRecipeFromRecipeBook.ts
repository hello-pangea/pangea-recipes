import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import {
  getRecipeQueryOptions,
  listRecipesQueryOptions,
} from '../../recipes/index.js';
import { recipeBookSchema } from '../types/recipeBook.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

export const removeRecipeFromRecipeBookContract = defineContract(
  'recipe-books/:id/recipes/:recipeId',
  {
    method: 'delete',
    params: z.object({
      id: z.uuidv4(),
      recipeId: z.uuidv4(),
    }),
    response: {
      200: z.object({
        recipeBook: recipeBookSchema,
      }),
    },
  },
);

const removeRecipeFromRecipeBook = makeRequest(
  removeRecipeFromRecipeBookContract,
  {
    select: (res) => res.recipeBook,
  },
);

interface Options {
  mutationConfig?: MutationConfig<typeof removeRecipeFromRecipeBook>;
}

export function useRemoveRecipeFromRecipeBook({
  mutationConfig,
}: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });
      void queryClient.invalidateQueries({
        queryKey: getRecipeQueryOptions(args[1].params.recipeId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: listRecipesQueryOptions({}).queryKey,
      });
      queryClient.setQueryData(
        getRecipeBookQueryOptions(data.id).queryKey,
        data,
      );

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeRecipeFromRecipeBook,
  });
}
