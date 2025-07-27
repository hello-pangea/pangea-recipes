import { z } from 'zod/v4';

export const createRecipeBookDtoScema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1).optional().nullable(),
    access: z.enum(['private', 'public']).optional(),
  })
  .meta({
    id: 'CreateRecipeBookDto',
  });

export type CreateRecipeBookDto = z.infer<typeof createRecipeBookDtoScema>;
