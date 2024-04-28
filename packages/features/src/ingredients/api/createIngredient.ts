import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { Ingredient } from '../types/ingredient.js';

export interface CreateIngredientDTO {
  name: string;
  pluralName?: string;
}

function createIngredient(data: CreateIngredientDTO) {
  return api
    .post(`ingredients`, { json: data })
    .then((res) => res.json<{ ingredient: Ingredient }>());
}

interface Options {
  config?: MutationConfig<typeof createIngredient>;
}

export function useCreateIngredeint({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: createIngredient,
  });
}
