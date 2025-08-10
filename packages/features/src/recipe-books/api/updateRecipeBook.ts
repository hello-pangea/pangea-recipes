import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { recipeBookSchema } from '../types/recipeBook.js';
import { createRecipeBookContract } from './createRecipeBook.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

export const updateRecipeBookContract = defineContract('recipe-books/:id', {
  method: 'patch',
  params: z.object({
    id: z.uuidv4(),
  }),
  body: createRecipeBookContract.body
    .pick({
      name: true,
      description: true,
      access: true,
    })
    .partial(),
  response: {
    200: z.object({
      recipeBook: recipeBookSchema,
    }),
  },
});

const updateRecipeBook = makeRequest(updateRecipeBookContract, {
  select: (res) => res.recipeBook,
});

interface Options {
  mutationConfig?: MutationConfig<typeof updateRecipeBook>;
}

export function useUpdateRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });
      queryClient.setQueryData(
        getRecipeBookQueryOptions(data.id).queryKey,
        data,
      );

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateRecipeBook,
  });
}
