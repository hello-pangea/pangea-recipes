import type { Prisma } from '@prisma/client';
import { Type, type Static } from '@sinclair/typebox';
import { foodSchema } from '../../foods/index.js';
import { Nullable } from '../../lib/nullable.js';
import { unitSchema } from '../../units/index.js';

export type Recipe = Static<typeof recipeSchema>;
export const recipeSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    name: Type.String(),

    description: Nullable(Type.String()),

    coverImage: Nullable(Type.String()),

    ingredients: Type.Array(
      Type.Object({
        id: Type.String(),
        food: foodSchema,
        amount: Nullable(Type.Unsafe<Prisma.Decimal>(Type.Number())),
        unit: Type.Union([unitSchema, Type.Null()]),
        notes: Nullable(Type.String()),
      }),
    ),

    instructionGroups: Type.Array(
      Type.Object({
        title: Nullable(Type.String()),
        instructions: Type.Array(
          Type.Object({
            id: Type.String(),
            text: Type.String(),
          }),
        ),
      }),
    ),

    usesRecipes: Type.Optional(Type.Array(Type.String())),
  },
  { $id: 'Recipe' },
);

export const recipeSchemaRef = Type.Ref(recipeSchema);
