import { Type, type Static } from '@sinclair/typebox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { EndpointSpec } from '../../lib/endpointSpec.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import {
  canonicalIngredientSchemaRef,
  type CanonicalIngredient,
} from '../types/canonicalIngredient.js';
import { createCanonicalIngredientSpec } from './createCanonicalIngredient.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export const updateCanonicalIngredientSpec = {
  body: Type.Partial(
    Type.Pick(createCanonicalIngredientSpec.body, [
      'name',
      'iconId',
      'aliases',
    ]),
  ),
  response: Type.Object({
    canonicalIngredient: canonicalIngredientSchemaRef,
  }),
} satisfies EndpointSpec;
type Body = Static<typeof updateCanonicalIngredientSpec.body>;
type Response = Static<typeof updateCanonicalIngredientSpec.response>;

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
