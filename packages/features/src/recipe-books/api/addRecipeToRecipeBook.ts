import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeQueryOptions } from '../../recipes/index.js';
import type { RecipeBook } from '../types/recipeBook.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

interface AddRecipeToRecipeBook {
  recipeBookId: string;
  recipeId: string;
}

function addRecipeToRecipeBook(
  data: AddRecipeToRecipeBook,
): Promise<RecipeBook> {
  return api
    .post(`recipe-books/${data.recipeBookId}/recipes`, {
      json: { recipeId: data.recipeId },
    })
    .json<{ recipeBook: RecipeBook }>()
    .then((res) => res.recipeBook);
}

interface Options {
  mutationConfig?: MutationConfig<typeof addRecipeToRecipeBook>;
}

export function useAddRecipeToRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });
      void queryClient.invalidateQueries({
        queryKey: getRecipeQueryOptions(args[1].recipeId).queryKey,
      });
      queryClient.setQueryData(
        getRecipeBookQueryOptions(data.id).queryKey,
        data,
      );

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addRecipeToRecipeBook,
  });
}
