import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';

export const acceptRecipeBookRequestContract = defineContract(
  'recipe-book-requests/:id/accept',
  {
    method: 'post',
    params: z.object({
      id: z.uuidv4(),
    }),
    body: z.object({
      role: z.enum(['owner', 'editor', 'viewer']),
    }),
    response: {
      200: noContent,
    },
  },
);

const acceptRecipeBookRequest = makeRequest(acceptRecipeBookRequestContract);

interface Options {
  mutationConfig?: MutationConfig<typeof acceptRecipeBookRequest>;
}

export function useAcceptRecipeBookRequest({ mutationConfig }: Options = {}) {
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
    mutationFn: acceptRecipeBookRequest,
  });
}
