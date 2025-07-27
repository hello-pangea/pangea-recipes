import type { z } from 'zod/v4';
import { createRecipeBookDtoScema } from './createRecipeBookDto.js';

export const updateRecipeBookDtoScema = createRecipeBookDtoScema
  .pick({
    name: true,
    description: true,
    access: true,
  })
  .partial();

export type UpdateRecipeBookDto = z.infer<typeof updateRecipeBookDtoScema>;
