import { Type, type Static } from '@sinclair/typebox';

export type SetupUserDto = Static<typeof setupUserDtoSchema>;
export const setupUserDtoSchema = Type.Object({
  name: Type.Optional(Type.String()),
});
