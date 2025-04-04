import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { EndpointSpec } from '../../lib/endpointSpec.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import {
  canonicalIngredientSchemaRef,
  type CanonicalIngredient,
} from '../types/canonicalIngredient.js';
import { getListCanonicalIngredientsQueryOptions } from './listCanonicalIngredients.js';

export const createCanonicalIngredientSpec = {
  body: Type.Object({
    name: Type.String({ minLength: 1 }),
    iconId: Type.Optional(Type.String({ format: 'uuid' })),
    aliases: Type.Optional(Type.Array(Type.String({ minLength: 1 }))),
  }),
  response: Type.Object({
    canonicalIngredient: canonicalIngredientSchemaRef,
  }),
} satisfies EndpointSpec;
type Body = Static<typeof createCanonicalIngredientSpec.body>;
type Response = Static<typeof createCanonicalIngredientSpec.response>;

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

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCanonicalIngredient,
  });
}
