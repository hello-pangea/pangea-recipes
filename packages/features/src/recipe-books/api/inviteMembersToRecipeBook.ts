import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

export const inviteMembersToRecipeBookBodySchema = z
  .object({
    emails: z.array(z.email()).optional(),
    userIds: z.array(z.uuidv4()).optional(),
    role: z.enum(['owner', 'editor', 'viewer']),
  })
  .meta({
    id: 'InviteMembersToRecipeBookBody',
  });

export type InviteMembersToRecipeBook = z.infer<
  typeof inviteMembersToRecipeBookBodySchema
> & {
  recipeBookId: string;
};

function inviteMembersToRecipeBook(data: InviteMembersToRecipeBook) {
  return api.post(`recipe-books/${data.recipeBookId}/members`, {
    json: { emails: data.emails, role: data.role, userIds: data.userIds },
  });
}

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
        queryKey: getRecipeBookQueryOptions(input.recipeBookId).queryKey,
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
