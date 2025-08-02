import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

export const deleteRecipeBookMemberContract = defineContract(
  'recipe-books/:id/members/:userId',
  {
    method: 'delete',
    params: z.object({
      id: z.uuidv4(),
      userId: z.uuidv4(),
    }),
    response: {
      200: noContent,
    },
  },
);

const deleteRecipeBookMember = makeRequest(deleteRecipeBookMemberContract);

interface Options {
  mutationConfig?: MutationConfig<typeof deleteRecipeBookMember>;
}

export function useDeleteRecipeBookMember({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [_data, input] = args;

      void queryClient.invalidateQueries({
        queryKey: getRecipeBookQueryOptions(input.params.id).queryKey,
      });

      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRecipeBookMember,
  });
}
