import { Type, type Static } from '@sinclair/typebox';

const foodSchemaId = 'Food';

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

    icon: Type.Optional(
      Type.Object({
        id: Type.String({ format: 'uri' }),
        url: Type.String(),
      }),
    ),
  },
  { $id: foodSchemaId },
);

export const foodSchemaRef = Type.Unsafe<Food>(Type.Ref(foodSchemaId));
