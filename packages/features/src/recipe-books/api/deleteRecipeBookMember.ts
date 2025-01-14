import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';
import { getListRecipeBooksQueryOptions } from './listRecipeBooks.js';

interface DeleteRecipeBookInvite {
  recipeBookId: string;
  userId: string;
}

function deleteRecipeBookMember(data: DeleteRecipeBookInvite) {
  return api.delete(`recipe-books/${data.recipeBookId}/members/${data.userId}`);
}

interface Options {
  mutationConfig?: MutationConfig<typeof deleteRecipeBookMember>;
}

export function useDeleteRecipeBookMember({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [_data, input] = args;

      void queryClient.invalidateQueries({
        queryKey: getRecipeBookQueryOptions(input.recipeBookId).queryKey,
      });

      void queryClient.invalidateQueries({
        queryKey: getListRecipeBooksQueryOptions({ userId: '' }).queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRecipeBookMember,
  });
}
