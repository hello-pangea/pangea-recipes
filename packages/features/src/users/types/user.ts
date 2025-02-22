import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';

const userSchemaId = 'User';

export type User = Static<typeof userSchema>;
export const userSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    name: Type.String(),

    email: Type.String(),
    emailVerified: Type.Boolean(),

    image: Nullable(Type.String()),

    accessRole: Type.Union([Type.Literal('admin'), Type.Literal('user')]),

    themePreference: Type.Union([
      Type.Literal('light'),
      Type.Literal('dark'),
      Type.Literal('system'),
    ]),

    unitsPreference: Type.Union([
      Type.Literal('imperial'),
      Type.Literal('metric'),
    ]),
  },
  { $id: userSchemaId },
);

export const userSchemaRef = Type.Unsafe<User>(Type.Ref(userSchemaId));
