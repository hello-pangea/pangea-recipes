import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import type { Unit } from '../types/unit.js';

export interface CreateUnitDTO {
  data: {
    name: string;
    pluralName?: string;
  };
}

function createUnit({ data }: CreateUnitDTO) {
  return api
    .post(`units`, { json: data })
    .then((res) => res.json<{ unit: Unit }>());
}

interface Options {
  config?: MutationConfig<typeof createUnit>;
}

export function useCreateUnit({ config }: Options = {}) {
  return useMutation({
    ...config,
    mutationFn: createUnit,
  });
}
