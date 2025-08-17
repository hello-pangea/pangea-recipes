import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { importedRecipeSchema } from '../types/importedRecipe.js';

export const importRecipeContract = defineContract('recipe-imports', {
  method: 'post',
  body: z.object({
    url: z.url(),
  }),
  response: {
    200: z.object({
      websitePageId: z.uuidv4(),
      recipe: importedRecipeSchema,
    }),
  },
});

const importRecipe = makeRequest(importRecipeContract, {
  ky: {
    timeout: 60000,
  },
});

interface Options {
  mutationConfig?: MutationConfig<typeof importRecipe>;
}

export function useImportRecipe({ mutationConfig }: Options = {}) {
  return useMutation({
    ...mutationConfig,
    mutationFn: importRecipe,
  });
}
