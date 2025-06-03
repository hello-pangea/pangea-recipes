import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';

export interface DeleteRecipeBookDTO {
  recipeBookId: string;
}

function deleteRecipeBook({ recipeBookId }: DeleteRecipeBookDTO) {
  return api.delete(`recipe-books/${recipeBookId}`).then(() => null);
}

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
