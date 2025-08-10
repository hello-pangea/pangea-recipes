import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';

export const requestAccessToRecipeBookContract = defineContract(
  'recipe-book-requests',
  {
    method: 'post',
    body: z.object({
      recipeBookId: z.uuidv4(),
    }),
    response: {
      200: noContent,
    },
  },
);

const requestAccessToRecipeBook = makeRequest(
  requestAccessToRecipeBookContract,
);

interface Options {
  mutationConfig?: MutationConfig<typeof requestAccessToRecipeBook>;
}

export function useRequestAccessToRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['recipeBookRequests'],
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: requestAccessToRecipeBook,
  });
}
