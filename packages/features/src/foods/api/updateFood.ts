import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { Food } from '../types/food.js';
import type { UpdateFoodDto } from '../types/updateFoodDto.js';
import { getListFoodsQueryOptions } from './listFoods.js';

function updateFood(data: UpdateFoodDto & { id: string }) {
  return api
    .patch(`foods/${data.id}`, { json: data })
    .then((res) => res.json<{ food: Food }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof updateFood>;
}

export function useUpdateFood({ mutationConfig }: Options = {}) {
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
    mutationFn: updateFood,
  });
}
