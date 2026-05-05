import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.ts';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import type { MutationConfig } from '../../lib/tanstackQuery.ts';

export const acceptRecipeBookRequestContract = defineContract('recipe-book-requests/:id/accept', {
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
});

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
