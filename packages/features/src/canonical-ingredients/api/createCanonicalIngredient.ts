import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CanonicalIngredient } from '../types/canonicalIngredient.js';
import type { CreateCanonicalIngredientDto } from '../types/createCanonicalIngredientDto.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

function createCanonicalIngredient(
  data: CreateCanonicalIngredientDto,
): Promise<CanonicalIngredient> {
  return api
    .post(`canonical-ingredients`, { json: data })
    .json<{ canonicalIngredient: CanonicalIngredient }>()
    .then((res) => res.canonicalIngredient);
}

interface Options {
  mutationConfig?: MutationConfig<typeof createCanonicalIngredient>;
}

export function useCreateCanonicalIngredient({ mutationConfig }: Options = {}) {
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
    mutationFn: createCanonicalIngredient,
  });
}
