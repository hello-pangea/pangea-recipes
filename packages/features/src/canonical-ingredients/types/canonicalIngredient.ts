import { Type, type Static } from '@sinclair/typebox';

const canonicalIngredientSchemaId = 'CanonicalIngredient';

export type CanonicalIngredient = Static<typeof canonicalIngredientSchema>;
export const canonicalIngredientSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    name: Type.String(),

    icon: Type.Optional(
      Type.Object({
        id: Type.String({ format: 'uri' }),
        url: Type.String(),
      }),
    ),
  },
  { $id: canonicalIngredientSchemaId },
);

export const canonicalIngredientSchemaRef = Type.Unsafe<CanonicalIngredient>(
  Type.Ref(canonicalIngredientSchemaId),
);
