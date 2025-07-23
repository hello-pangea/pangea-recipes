import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';

export type PublicProfile = Static<typeof publicProfileSchema>;
export const publicProfileSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    name: Type.String(),

    image: Nullable(Type.String()),
  },
  { $id: 'PublicProfile' },
);
