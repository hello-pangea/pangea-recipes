import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { RecipeBook } from '../types/recipeBook.js';
import type { UpdateRecipeBookDto } from '../types/updateRecipeBookDto.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';
import { getListRecipeBooksQueryOptions } from './listRecipeBooks.js';

function updateRecipeBook(
  data: UpdateRecipeBookDto & { id: string },
): Promise<RecipeBook> {
  return api
    .patch(`recipe-books/${data.id}`, { json: data })
    .json<{ recipeBook: RecipeBook }>()
    .then((res) => res.recipeBook);
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
        getRecipeBookQueryOptions(data.id).queryKey,
        data,
      );

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateRecipeBook,
  });
}
