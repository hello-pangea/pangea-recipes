import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';

function requestAccessToRecipeBook(recipeBookId: string) {
  return api.post(`recipe-book-requests`, {
    json: { recipeBookId },
  });
}

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

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: requestAccessToRecipeBook,
  });
}
