import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { queryClient, type MutationConfig } from '../../lib/tanstackQuery.js';

export interface DeleteIngredientDTO {
  ingredientId: string;
}

function deleteIngredient({ ingredientId }: DeleteIngredientDTO) {
  return api.delete(`ingredients/${ingredientId}`).then(() => null);
}

interface Options {
  config?: MutationConfig<typeof deleteIngredient>;
}

export function useDeleteIngredient({ config }: Options = {}) {
  return useMutation({
    ...config,
    onSuccess: (...d) => {
      void queryClient.invalidateQueries({ queryKey: ['ingredients'] });

      config?.onSuccess?.(...d);
    },
    mutationFn: deleteIngredient,
  });
}
