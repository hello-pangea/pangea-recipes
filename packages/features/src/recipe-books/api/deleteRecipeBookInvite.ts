import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { noContent } from '../../lib/noContent.ts';
import { makeRequest } from '../../lib/request.ts';
import { defineContract } from '../../lib/routeContracts.ts';
import type { MutationConfig } from '../../lib/tanstackQuery.ts';
import { getRecipeBookQueryOptions } from './getRecipeBook.ts';

export const deleteRecipeBookInviteContract = defineContract('recipe-books/:id/invitations', {
  method: 'delete',
  params: z.object({
    id: z.uuidv4(),
  }),
  body: z.object({
    inviteeEmail: z.email(),
  }),
  response: {
    200: noContent,
  },
});

const deleteRecipeBookInvite = makeRequest(deleteRecipeBookInviteContract);

interface Options {
  mutationConfig?: MutationConfig<typeof deleteRecipeBookInvite>;
}

export function useDeleteRecipeBookInvite({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [_data, input] = args;

      void queryClient.invalidateQueries({
        queryKey: getRecipeBookQueryOptions(input.params.id).queryKey,
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRecipeBookInvite,
  });
}
