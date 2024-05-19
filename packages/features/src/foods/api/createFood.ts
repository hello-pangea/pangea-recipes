import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CreateFoodDto } from '../types/createFoodDto.js';
import type { Food } from '../types/food.js';
import { getListFoodsQueryOptions } from './listFoods.js';

function createFood(data: CreateFoodDto) {
  return api
    .post(`foods`, { json: data })
    .then((res) => res.json<{ food: Food }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof createFood>;
}

export function useCreateFood({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getListFoodsQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createFood,
  });
}
