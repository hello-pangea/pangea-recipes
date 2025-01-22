import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CanonicalIngredient } from '../types/canonicalIngredient.js';
import type { UpdateCanonicalIngredientDto } from '../types/updateCanonicalIngredientDto.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

function updateCanonicalIngredient(
  data: UpdateCanonicalIngredientDto & { id: string },
): Promise<CanonicalIngredient> {
  return api
    .patch(`canonical-ingredients/${data.id}`, { json: data })
    .json<{ canonicalIngredient: CanonicalIngredient }>()
    .then((res) => res.canonicalIngredient);
}

interface Options {
  mutationConfig?: MutationConfig<typeof updateCanonicalIngredient>;
}

export function useUpdateCanonicalIngredient({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getListCanonicalIngredientsQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateCanonicalIngredient,
  });
}
