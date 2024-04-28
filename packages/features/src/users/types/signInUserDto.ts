import { Type, type Static } from '@sinclair/typebox';

export type SignInUserDto = Static<typeof signInUserDtoSchema>;
export const signInUserDtoSchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
});
