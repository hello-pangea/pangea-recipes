import type { Prisma } from '@prisma/client';
import { Type, type Static } from '@sinclair/typebox';

export type Food = Static<typeof foodSchema>;
export const foodSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    name: Type.String(),
    pluralName: Type.Union([Type.Null(), Type.String()]),

    density: Type.Union([
      Type.Null(),
      Type.Unsafe<Prisma.Decimal>(Type.Number()),
    ]),
  },
  { $id: 'Food' },
);

export const foodSchemaRef = Type.Ref(foodSchema);
