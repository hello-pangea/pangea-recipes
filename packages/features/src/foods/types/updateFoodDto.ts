import { Type, type Static } from '@sinclair/typebox';
import { createFoodDtoScema } from './createFoodDto.js';

export type UpdateFoodDto = Static<typeof updateFoodDtoSchema>;
export const updateFoodDtoSchema = Type.Partial(
  Type.Pick(createFoodDtoScema, ['name', 'pluralName', 'iconId']),
);
