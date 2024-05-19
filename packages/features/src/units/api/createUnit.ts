import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { CreateUnitDto } from '../types/createUnitDto.js';
import type { Unit } from '../types/unit.js';
import { getListUnitsQueryOptions } from './listUnits.js';

function createUnit(data: CreateUnitDto) {
  return api
    .post(`units`, { json: data })
    .then((res) => res.json<{ unit: Unit }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof createUnit>;
}

export function useCreateUnit({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: getListUnitsQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUnit,
  });
}
