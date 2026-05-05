import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.ts';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import { type MutationConfig } from '../../lib/tanstackQuery.ts';
import { listCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.ts';

export const deleteCanonicalIngredientContract = defineContract('canonical-ingredients/:id', {
  method: 'delete',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: noContent,
  },
});

const deleteCanonicalIngredient = makeRequest(deleteCanonicalIngredientContract);

interface Options {
  mutationConfig?: MutationConfig<typeof deleteCanonicalIngredient>;
}

export function useDeleteCanonicalIngredient({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: listCanonicalIngredientsQueryOptions().queryKey,
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCanonicalIngredient,
  });
}
