import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';

export type User = Static<typeof userSchema>;
export const userSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    name: Nullable(Type.String()),

    email: Type.String(),

    accessRole: Type.Union([Type.Literal('admin'), Type.Literal('user')]),

    themePreference: Type.Union([
      Type.Literal('light'),
      Type.Literal('dark'),
      Type.Literal('system'),
      Type.Literal('autumn'),
      Type.Literal('mint'),
    ]),
  },
  { $id: 'User' },
);

export const userSchemaRef = Type.Ref(userSchema);
