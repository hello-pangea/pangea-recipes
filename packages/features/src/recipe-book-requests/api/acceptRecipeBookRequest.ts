import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';

function acceptRecipeBookRequest(data: {
  recipeBookRequestId: string;
  role: 'viewer' | 'editor' | 'owner';
}): Promise<null> {
  return api
    .post(`recipe-book-requests/${data.recipeBookRequestId}/accept`, {
      json: { role: data.role },
    })
    .json<null>();
}

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

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: acceptRecipeBookRequest,
  });
}
