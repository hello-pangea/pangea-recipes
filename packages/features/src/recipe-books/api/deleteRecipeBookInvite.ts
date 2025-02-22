import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

interface DeleteRecipeBookInvite {
  recipeBookId: string;
  inviteeEmail: string;
}

function deleteRecipeBookInvite(data: DeleteRecipeBookInvite) {
  return api.delete(`recipe-books/${data.recipeBookId}/invitations`, {
    json: {
      inviteeEmail: data.inviteeEmail,
    },
  });
}

interface Options {
  mutationConfig?: MutationConfig<typeof deleteRecipeBookInvite>;
}

export function useDeleteRecipeBookInvite({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [_data, input] = args;

      void queryClient.invalidateQueries({
        queryKey: getRecipeBookQueryOptions(input.recipeBookId).queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRecipeBookInvite,
  });
}
