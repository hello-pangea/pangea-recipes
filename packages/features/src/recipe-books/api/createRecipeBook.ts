import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CreateRecipeBookDto } from '../types/createRecipeBookDto.js';
import type { RecipeBook } from '../types/recipeBook.js';
import { getListRecipeBooksQueryOptions } from './listRecipeBooks.js';

function createRecipeBook(data: CreateRecipeBookDto) {
  return api
    .post(`recipe-books`, { json: data })
    .then((res) => res.json<{ recipeBook: RecipeBook }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof createRecipeBook>;
}

export function useCreateRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getListRecipeBooksQueryOptions({ userId: '' }).queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createRecipeBook,
  });
}
