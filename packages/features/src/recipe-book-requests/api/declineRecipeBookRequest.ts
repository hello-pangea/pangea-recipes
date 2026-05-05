import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.ts';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import type { MutationConfig } from '../../lib/tanstackQuery.ts';

export const declineRecipeBookRequestContract = defineContract('recipe-book-requests/:id/decline', {
  method: 'post',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: noContent,
  },
});

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
