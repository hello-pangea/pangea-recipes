import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { canonicalIngredientSchema } from '../types/canonicalIngredient.js';
import { createCanonicalIngredientContract } from './createCanonicalIngredient.js';
import { listCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export const updateCanonicalIngredientContract = defineContract(
  'canonical-ingredients/:id',
  {
    method: 'patch',
    params: z.object({
      id: z.uuidv4(),
    }),
    body: createCanonicalIngredientContract.body
      .pick({
        name: true,
        iconId: true,
        aliases: true,
      })
      .partial(),
    response: {
      200: z.object({
        canonicalIngredient: canonicalIngredientSchema,
      }),
    },
  },
);

const updateCanonicalIngredient = makeRequest(
  updateCanonicalIngredientContract,
  {
    select: (res) => res.canonicalIngredient,
  },
);

interface Options {
  mutationConfig?: MutationConfig<typeof updateCanonicalIngredient>;
}

export function useUpdateCanonicalIngredient({ mutationConfig }: Options = {}) {
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
    mutationFn: updateCanonicalIngredient,
  });
}
