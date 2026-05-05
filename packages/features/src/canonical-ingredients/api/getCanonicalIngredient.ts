import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import { canonicalIngredientSchema } from '../types/canonicalIngredient.ts';

export const getCanonicalIngredientContract = defineContract('canonical-ingredients/:id', {
  method: 'get',
  params: z.object({
    id: z.uuidv4(),
  }),
  response: {
    200: z.object({
      canonicalIngredient: canonicalIngredientSchema,
    }),
  },
});

const getCanonicalIngredient = makeRequest(getCanonicalIngredientContract, {
  select: (res) => res.canonicalIngredient,
});

export function getCanonicalIngredientQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['canonicalIngredients', id],
    queryFn: () => getCanonicalIngredient({ params: { id } }),
  });
}
