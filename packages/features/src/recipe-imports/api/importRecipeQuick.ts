import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';

export const importRecipeQuickContract = defineContract(
  'recipe-imports/quick',
  {
    method: 'post',
    body: z.object({
      url: z.url(),
    }),
    response: {
      202: noContent,
    },
  },
);

const importRecipeQuick = makeRequest(importRecipeQuickContract, {
  ky: {
    timeout: 60000,
  },
});

interface Options {
  mutationConfig?: MutationConfig<typeof importRecipeQuick>;
}

export function useImportRecipeQuick({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['recipeImports'],
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: importRecipeQuick,
  });
}
