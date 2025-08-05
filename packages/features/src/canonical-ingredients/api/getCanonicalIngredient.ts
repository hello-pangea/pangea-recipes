import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import { canonicalIngredientSchema } from '../types/canonicalIngredient.js';

export const getCanonicalIngredientContract = defineContract(
  'canonical-ingredients/:id',
  {
    method: 'get',
    params: z.object({
      id: z.uuidv4(),
    }),
    response: {
      200: z.object({
        canonicalIngredient: canonicalIngredientSchema,
      }),
    },
  },
);

const getCanonicalIngredient = makeRequest(getCanonicalIngredientContract, {
  select: (res) => res.canonicalIngredient,
});

export function getCanonicalIngredientQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['canonicalIngredients', id],
    queryFn: () => getCanonicalIngredient({ params: { id } }),
  });
}
