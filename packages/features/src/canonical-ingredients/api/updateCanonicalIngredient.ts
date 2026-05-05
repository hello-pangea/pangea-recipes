import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import type { MutationConfig } from '../../lib/tanstackQuery.ts';
import { canonicalIngredientSchema } from '../types/canonicalIngredient.ts';
import { createCanonicalIngredientContract } from './createCanonicalIngredient.ts';
import { listCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.ts';

export const updateCanonicalIngredientContract = defineContract('canonical-ingredients/:id', {
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
});

const updateCanonicalIngredient = makeRequest(updateCanonicalIngredientContract, {
  select: (res) => res.canonicalIngredient,
});

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
