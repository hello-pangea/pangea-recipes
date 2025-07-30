import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export const deleteCanonicalIngredientContract = defineContract(
  'canonical-ingredients/:id',
  {
    method: 'delete',
    params: z.object({
      id: z.uuidv4(),
    }),
    response: {
      200: noContent,
    },
  },
);

const deleteCanonicalIngredient = makeRequest(
  deleteCanonicalIngredientContract,
);

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
