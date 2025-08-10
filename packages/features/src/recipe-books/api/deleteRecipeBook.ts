import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';

export const deleteRecipeBookContract = defineContract('recipe-books/:id', {
  method: 'delete',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: noContent,
  },
});

const deleteRecipeBook = makeRequest(deleteRecipeBookContract);

interface Options {
  mutationConfig?: MutationConfig<typeof deleteRecipeBook>;
}

export function useDeleteRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRecipeBook,
  });
}
