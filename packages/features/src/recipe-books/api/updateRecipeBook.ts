import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { RecipeBook } from '../types/recipeBook.js';
import type { UpdateRecipeBookDto } from '../types/updateRecipeBookDto.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';
import { getListRecipeBooksQueryOptions } from './listRecipeBooks.js';

function updateRecipeBook(data: UpdateRecipeBookDto & { id: string }) {
  return api
    .patch(`recipe-books/${data.id}`, { json: data })
    .then((res) => res.json<{ recipeBook: RecipeBook }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof updateRecipeBook>;
}

export function useUpdateRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: getListRecipeBooksQueryOptions({ userId: '' }).queryKey,
      });
      queryClient.setQueryData(
        getRecipeBookQueryOptions(data.recipeBook.id).queryKey,
        data,
      );

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateRecipeBook,
  });
}
