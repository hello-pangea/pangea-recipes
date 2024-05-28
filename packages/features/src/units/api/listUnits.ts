import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { Unit } from '../types/unit.js';

function listUnits() {
  return api.get(`units`).then((res) => res.json<{ units: Unit[] }>());
}

export function getListUnitsQueryOptions() {
  return queryOptions({
    queryKey: ['units'],
    queryFn: () => listUnits(),
  });
}

interface Options {
  queryConfig?: QueryConfig<typeof getListUnitsQueryOptions>;
}

export function useUnits({ queryConfig }: Options = {}) {
  return useQuery({
    ...getListUnitsQueryOptions(),
    ...queryConfig,
  });
}
