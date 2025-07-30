import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { recipeBookSchema } from '../types/recipeBook.js';

export const createRecipeBookContract = defineContract('recipe-books', {
  method: 'post',
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1).optional().nullable(),
    access: z.enum(['private', 'public']).optional(),
  }),
  response: {
    200: z.object({
      recipeBook: recipeBookSchema,
    }),
  },
});

const createRecipeBook = makeRequest(createRecipeBookContract, {
  select: (res) => res.recipeBook,
});

interface Options {
  mutationConfig?: MutationConfig<typeof createRecipeBook>;
}

export function useCreateRecipeBook({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createRecipeBook,
  });
}
