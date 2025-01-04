import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeQueryOptions } from '../../recipes/index.js';
import type { RecipeBook } from '../types/recipeBook.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';
import { getListRecipeBooksQueryOptions } from './listRecipeBooks.js';

interface RemoveRecipeFromRecipeBook {
  recipeBookId: string;
  recipeId: string;
}

function removeRecipeFromRecipeBook(data: RemoveRecipeFromRecipeBook) {
  return api
    .post(`recipe-books/${data.recipeBookId}/recipes/${data.recipeId}`)
    .json<{ recipeBook: RecipeBook }>();
}

interface Options {
  mutationConfig?: MutationConfig<typeof removeRecipeFromRecipeBook>;
}

export function useRemoveRecipeFromRecipeBook({
  mutationConfig,
}: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: getListRecipeBooksQueryOptions({ userId: '' }).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: getRecipeQueryOptions(args[1].recipeId).queryKey,
      });
      queryClient.setQueryData(
        getRecipeBookQueryOptions(data.recipeBook.id).queryKey,
        data,
      );

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeRecipeFromRecipeBook,
  });
}
