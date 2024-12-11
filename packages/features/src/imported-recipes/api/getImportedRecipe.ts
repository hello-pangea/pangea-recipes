import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { QueryConfig } from '../../lib/tanstackQuery.js';
import type { ImportedRecipe } from '../types/importedRecipe.js';

function getImportedRecipe(url: string) {
  return api
    .get(`imported-recipes?url=${url}`, { timeout: 60000 })
    .then((res) =>
      res.json<{ importedRecipe: ImportedRecipe; websitePageId: string }>(),
    );
}

function getImportedRecipeQueryOptions(url: string) {
  return queryOptions({
    queryKey: ['importedRecipes', url],
    queryFn: () => getImportedRecipe(url),
  });
}

interface Options {
  url: string;
  queryConfig?: QueryConfig<typeof getImportedRecipeQueryOptions>;
}

export function useImportedRecipe({ url, queryConfig }: Options) {
  return useQuery({
    ...getImportedRecipeQueryOptions(url),
    ...queryConfig,
  });
}
