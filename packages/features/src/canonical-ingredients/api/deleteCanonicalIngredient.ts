import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export interface DeleteCanonicalIngredientDTO {
  canonicalIngredientId: string;
}

function deleteCanonicalIngredient({
  canonicalIngredientId,
}: DeleteCanonicalIngredientDTO) {
  return api
    .delete(`canonical-ingredients/${canonicalIngredientId}`)
    .then(() => null);
}

interface Options {
  mutationConfig?: MutationConfig<typeof deleteCanonicalIngredient>;
}

export function useDeleteCanonicalIngredient({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getListCanonicalIngredientsQueryOptions().queryKey,
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCanonicalIngredient,
  });
}
