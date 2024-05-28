import { Type, type Static } from '@sinclair/typebox';

export type CreateFoodDto = Static<typeof createFoodDtoScema>;
export const createFoodDtoScema = Type.Object({
  name: Type.String({ minLength: 1 }),
  pluralName: Type.Optional(Type.String({ minLength: 1 })),
});
