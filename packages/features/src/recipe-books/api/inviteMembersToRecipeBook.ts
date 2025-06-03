import { Type, type Static } from '@sinclair/typebox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { getRecipeBookQueryOptions } from './getRecipeBook.js';

type InviteMembersToRecipeBook = Static<
  typeof inviteMembersToRecipeBookBodySchema
> & {
  recipeBookId: string;
};
export const inviteMembersToRecipeBookBodySchema = Type.Object({
  emails: Type.Optional(Type.Array(Type.String({ format: 'email' }))),
  userIds: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
  role: Type.Union([
    Type.Literal('owner'),
    Type.Literal('editor'),
    Type.Literal('viewer'),
  ]),
});

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
