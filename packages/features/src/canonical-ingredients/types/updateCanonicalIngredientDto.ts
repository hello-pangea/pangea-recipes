import { Type, type Static } from '@sinclair/typebox';
import { createCanonicalIngredientDtoScema } from './createCanonicalIngredientDto.js';

export type UpdateCanonicalIngredientDto = Static<
  typeof updateCanonicalIngredientDtoSchema
>;
export const updateCanonicalIngredientDtoSchema = Type.Partial(
  Type.Pick(createCanonicalIngredientDtoScema, ['name', 'iconId']),
);
