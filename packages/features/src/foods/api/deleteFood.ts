import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { queryClient, type MutationConfig } from '../../lib/tanstackQuery.js';

export interface DeleteFoodDTO {
  foodId: string;
}

function deleteFood({ foodId }: DeleteFoodDTO) {
  return api.delete(`foods/${foodId}`).then(() => null);
}

interface Options {
  config?: MutationConfig<typeof deleteFood>;
}

export function useDeleteFood({ config }: Options = {}) {
  return useMutation({
    ...config,
    onSuccess: (...d) => {
      void queryClient.invalidateQueries({ queryKey: ['foods'] });

      config?.onSuccess?.(...d);
    },
    mutationFn: deleteFood,
  });
}
