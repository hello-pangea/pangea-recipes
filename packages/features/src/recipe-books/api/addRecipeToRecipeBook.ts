import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import {
  getRecipeQueryOptions,
  listRecipesQueryOptions,
} from '../../recipes/index.js';
import { recipeBookSchema } from '../types/recipeBook.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

export const addRecipeToRecipeBookContract = defineContract(
  'recipe-books/:id/recipes',
  {
    method: 'post',
    params: z.object({
      id: z.uuidv4(),
    }),
    body: z.object({
      recipeId: z.uuidv4(),
    }),
    response: {
      200: z.object({
        recipeBook: recipeBookSchema,
      }),
    },
  },
);

const addRecipeToRecipeBook = makeRequest(addRecipeToRecipeBookContract, {
  select: (res) => res.recipeBook,
});

interface Options {
  mutationConfig?: MutationConfig<typeof addRecipeToRecipeBook>;
}

export function useAddRecipeToRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });
      void queryClient.invalidateQueries({
        queryKey: getRecipeQueryOptions(args[1].params.id).queryKey,
      });
      queryClient.setQueryData(
        getRecipeBookQueryOptions(data.id).queryKey,
        data,
      );
      void queryClient.invalidateQueries(
        listRecipesQueryOptions({
          recipeBookId: data.id,
        }),
      );

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addRecipeToRecipeBook,
  });
}
