import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { api } from '../../lib/api.js';
import type { EndpointSpec } from '../../lib/endpointSpec.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import {
  canonicalIngredientSchema,
  type CanonicalIngredient,
} from '../types/canonicalIngredient.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export const createCanonicalIngredientSpec = {
  body: z.object({
    name: z.string().min(1),
    iconId: z.uuidv4().optional(),
    aliases: z.array(z.string().min(1)).optional(),
  }),
  response: z.object({
    canonicalIngredient: canonicalIngredientSchema,
  }),
} satisfies EndpointSpec;
type Body = z.infer<typeof createCanonicalIngredientSpec.body>;
type Response = z.infer<typeof createCanonicalIngredientSpec.response>;

function createCanonicalIngredient(body: Body): Promise<CanonicalIngredient> {
  return api
    .post(`canonical-ingredients`, { json: body })
    .json<Response>()
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

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCanonicalIngredient,
  });
}
