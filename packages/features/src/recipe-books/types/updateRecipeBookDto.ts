import { Type, type Static } from '@sinclair/typebox';
import { createRecipeBookDtoScema } from './createRecipeBookDto.js';

export type UpdateRecipeBookDto = Static<typeof updateRecipeBookDtoScema>;
export const updateRecipeBookDtoScema = Type.Partial(
  Type.Pick(createRecipeBookDtoScema, ['name', 'description', 'access']),
);
