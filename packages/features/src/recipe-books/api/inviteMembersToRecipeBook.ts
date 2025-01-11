import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

interface InviteMembersToRecipeBook {
  recipeBookId: string;
  emails: string[];
  role: 'owner' | 'editor' | 'viewer';
}

function inviteMembersToRecipeBook(data: InviteMembersToRecipeBook) {
  return api.post(`recipe-books/${data.recipeBookId}/members`, {
    json: { emails: data.emails, role: data.role },
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

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: inviteMembersToRecipeBook,
  });
}
