import { Type, type Static } from '@sinclair/typebox';

export type SignUpUserDto = Static<typeof signUpUserDtoSchema>;
export const signUpUserDtoSchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.String({
    format: 'email',
  }),
  password: Type.String({
    minLength: 8,
  }),
});
