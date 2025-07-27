import { z } from 'zod/v4';
import { userSchema } from './user.js';

export const updateUserDtoSchema = userSchema
  .pick({
    themePreference: true,
    unitsPreference: true,
    accentColor: true,
    name: true,
  })
  .partial();

export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;
