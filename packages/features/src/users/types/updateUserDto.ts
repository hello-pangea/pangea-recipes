import { Type, type Static } from '@sinclair/typebox';
import { userSchema } from './user.js';

export type UpdateUserDto = Static<typeof updateUserDtoSchema>;
export const updateUserDtoSchema = Type.Partial(
  Type.Pick(userSchema, ['themePreference']),
);
