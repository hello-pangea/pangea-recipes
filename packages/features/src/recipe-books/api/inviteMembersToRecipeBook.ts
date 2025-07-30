import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { noContent } from '../../lib/noContent.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

export const inviteMembersToRecipeBookContract = defineContract(
  'recipe-books/:id/members',
  {
    method: 'post',
    params: z.object({
      id: z.uuidv4(),
    }),
    body: z.object({
      emails: z.array(z.email()).optional(),
      userIds: z.array(z.uuidv4()).optional(),
      role: z.enum(['owner', 'editor', 'viewer']),
    }),
    response: {
      200: noContent,
    },
  },
);

const inviteMembersToRecipeBook = makeRequest(
  inviteMembersToRecipeBookContract,
);

interface Options {
  mutationConfig?: MutationConfig<typeof inviteMembersToRecipeBook>;
}

export function useInviteMembersToRecipeBook({ mutationConfig }: Options = {}) {
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
    mutationFn: inviteMembersToRecipeBook,
  });
}
