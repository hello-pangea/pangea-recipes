import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { canonicalIngredientSchema } from '../types/canonicalIngredient.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export const createCanonicalIngredientContract = defineContract(
  'canonical-ingredients',
  {
    method: 'post',
    body: z.object({
      name: z.string().min(1),
      iconId: z.uuidv4().optional(),
      aliases: z.array(z.string().min(1)).optional(),
    }),
    response: {
      200: z.object({
        canonicalIngredient: canonicalIngredientSchema,
      }),
    },
  },
);

const createCanonicalIngredient = makeRequest(
  createCanonicalIngredientContract,
  {
    select: (res) => res.canonicalIngredient,
  },
);

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

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCanonicalIngredient,
  });
}
