import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { ImportedRecipe } from '../types/importedRecipe.js';

function getImportedRecipe(url: string) {
  return api
    .get(`imported-recipes?url=${url}`)
    .then((res) => res.json<{ importedRecipe: ImportedRecipe }>());
}

interface Options {
  url: string;
  config?: QueryConfig<typeof getImportedRecipe>;
}

export function useImportedRecipe({ url, config }: Options) {
  return useQuery({
    ...config,
    queryKey: ['importedRecipes', url],
    queryFn: () => getImportedRecipe(url),
  });
}
