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

    icon: Type.Optional(
      Type.Object({
        id: Type.String({ format: 'uri' }),
        url: Type.String(),
      }),
    ),
  },
  { $id: 'Food' },
);

export const foodSchemaRef = Type.Ref(foodSchema);
