import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';

export const declineRecipeBookRequestContract = defineContract(
  'recipe-book-requests/:id/decline',
  {
    method: 'post',
    params: z.object({
      id: z.uuidv4(),
    }),
    response: {
      200: noContent,
    },
  },
);

const declineRecipeBookRequest = makeRequest(declineRecipeBookRequestContract);

interface Options {
  mutationConfig?: MutationConfig<typeof declineRecipeBookRequest>;
}

export function useDeclineRecipeBookRequest({ mutationConfig }: Options = {}) {
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
    mutationFn: declineRecipeBookRequest,
  });
}
