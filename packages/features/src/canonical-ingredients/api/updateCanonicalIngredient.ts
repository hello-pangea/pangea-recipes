import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { api } from '../../lib/api.js';
import type { EndpointSpec } from '../../lib/endpointSpec.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import {
  canonicalIngredientSchema,
  type CanonicalIngredient,
} from '../types/canonicalIngredient.js';
import { createCanonicalIngredientSpec } from './createCanonicalIngredient.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export const updateCanonicalIngredientSpec = {
  body: createCanonicalIngredientSpec.body
    .pick({
      name: true,
      iconId: true,
      aliases: true,
    })
    .partial(),
  response: z.object({
    canonicalIngredient: canonicalIngredientSchema,
  }),
} satisfies EndpointSpec;
type Body = z.infer<typeof updateCanonicalIngredientSpec.body>;
type Response = z.infer<typeof updateCanonicalIngredientSpec.response>;

function updateCanonicalIngredient(
  data: Body & { id: string },
): Promise<CanonicalIngredient> {
  return api
    .patch(`canonical-ingredients/${data.id}`, { json: data })
    .json<Response>()
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

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateCanonicalIngredient,
  });
}
