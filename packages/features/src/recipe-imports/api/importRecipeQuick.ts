import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.ts';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import type { MutationConfig } from '../../lib/tanstackQuery.ts';

export const importRecipeQuickContract = defineContract('recipe-imports/quick', {
  method: 'post',
  body: z.object({
    url: z.url(),
  }),
  response: {
    202: noContent,
  },
});

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
