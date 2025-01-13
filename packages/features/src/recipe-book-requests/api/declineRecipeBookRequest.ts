import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';

function declineRecipeBookRequest(recipeBookRequestId: string): Promise<null> {
  return api
    .post(`recipe-book-requests/${recipeBookRequestId}/decline`)
    .json<null>();
}

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

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: declineRecipeBookRequest,
  });
}
