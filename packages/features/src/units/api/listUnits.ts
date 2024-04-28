import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Unit } from '../types/unit.js';

function listUnits() {
  return api.get(`units`).then((res) => res.json<{ units: Unit[] }>());
}

interface Options {
  config?: QueryConfig<typeof listUnits>;
}

export function useUnits({ config }: Options = {}) {
  return useQuery({
    ...config,
    queryKey: ['units'],
    queryFn: listUnits,
  });
}
