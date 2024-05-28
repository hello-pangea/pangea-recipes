import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { type MutationConfig } from '../../lib/tanstackQuery.js';
import { getListFoodsQueryOptions } from './listFoods.js';

export interface DeleteFoodDTO {
  foodId: string;
}

function deleteFood({ foodId }: DeleteFoodDTO) {
  return api.delete(`foods/${foodId}`).then(() => null);
}

interface Options {
  mutationConfig?: MutationConfig<typeof deleteFood>;
}

export function useDeleteFood({ mutationConfig }: Options = {}) {
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
    mutationFn: deleteFood,
  });
}
