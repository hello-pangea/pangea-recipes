import { Type, type Static } from '@sinclair/typebox';

export type CreateRecipeBookDto = Static<typeof createRecipeBookDtoScema>;
export const createRecipeBookDtoScema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String({ minLength: 1 })),
  access: Type.Optional(
    Type.Union([Type.Literal('private'), Type.Literal('public')]),
  ),
});
