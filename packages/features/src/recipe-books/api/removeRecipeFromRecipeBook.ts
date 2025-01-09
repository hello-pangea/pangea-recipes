import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import {
  getListRecipesQueryOptions,
  getRecipeQueryOptions,
} from '../../recipes/index.js';
import type { RecipeBook } from '../types/recipeBook.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';
import { getListRecipeBooksQueryOptions } from './listRecipeBooks.js';

interface RemoveRecipeFromRecipeBook {
  recipeBookId: string;
  recipeId: string;
}

function removeRecipeFromRecipeBook(
  data: RemoveRecipeFromRecipeBook,
): Promise<RecipeBook> {
  return api
    .delete(`recipe-books/${data.recipeBookId}/recipes/${data.recipeId}`)
    .json<{ recipeBook: RecipeBook }>()
    .then((res) => res.recipeBook);
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
      void queryClient.invalidateQueries({
        queryKey: getListRecipesQueryOptions({}).queryKey,
      });
      queryClient.setQueryData(
        getRecipeBookQueryOptions(data.id).queryKey,
        data,
      );

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeRecipeFromRecipeBook,
  });
}
