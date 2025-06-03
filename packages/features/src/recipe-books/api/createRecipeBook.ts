import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CreateRecipeBookDto } from '../types/createRecipeBookDto.js';
import type { RecipeBook } from '../types/recipeBook.js';

function createRecipeBook(data: CreateRecipeBookDto): Promise<RecipeBook> {
  return api
    .post(`recipe-books`, { json: data })
    .json<{ recipeBook: RecipeBook }>()
    .then((res) => res.recipeBook);
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
        queryKey: ['recipeBooks'],
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createRecipeBook,
  });
}
