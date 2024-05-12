import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { Food } from '../types/food.js';

export interface CreateFoodDTO {
  name: string;
  pluralName?: string;
}

function createFood(data: CreateFoodDTO) {
  return api
    .post(`foods`, { json: data })
    .then((res) => res.json<{ food: Food }>());
}

interface Options {
  config?: MutationConfig<typeof createFood>;
}

export function useCreateFood({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: createFood,
  });
}
