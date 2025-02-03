import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';
import { recipeBookRequestSchemaRef } from '../../recipe-book-requests/index.js';

const recipeBookSchemaId = 'RecipeBook';

export type RecipeBook = Static<typeof recipeBookSchema>;
export const recipeBookSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    name: Type.String(),

    description: Nullable(Type.String()),

    access: Type.Union([Type.Literal('public'), Type.Literal('private')]),

    members: Type.Array(
      Type.Object({
        userId: Type.String({ format: 'uuid' }),
        firstName: Nullable(Type.String()),
        lastName: Nullable(Type.String()),
        role: Type.Union([
          Type.Literal('owner'),
          Type.Literal('editor'),
          Type.Literal('viewer'),
        ]),
      }),
    ),
    invites: Type.Array(
      Type.Object({
        inviteeEmailAddress: Type.String({ format: 'email' }),
        role: Type.Union([
          Type.Literal('owner'),
          Type.Literal('editor'),
          Type.Literal('viewer'),
        ]),
      }),
    ),
    requests: Type.Array(recipeBookRequestSchemaRef),
  },
  { $id: recipeBookSchemaId },
);

export const recipeBookSchemaRef = Type.Unsafe<RecipeBook>(
  Type.Ref(recipeBookSchemaId),
);
