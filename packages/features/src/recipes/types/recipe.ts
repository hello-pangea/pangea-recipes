import type { Prisma } from '@prisma/client';
import { Type, type Static } from '@sinclair/typebox';
import { tagSchema } from '../../common/tag.js';
import { Nullable } from '../../lib/nullable.js';
import { unitSchema } from '../../units/index.js';

const recipeSchemaId = 'Recipe';

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

    websiteSource: Nullable(
      Type.Object({
        title: Nullable(Type.String()),
        url: Type.String(),
      }),
    ),

    images: Nullable(
      Type.Array(
        Type.Object({
          id: Type.String(),
          url: Type.String(),
          favorite: Type.Boolean(),
        }),
      ),
    ),

    ingredientGroups: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Nullable(Type.String()),
        ingredients: Type.Array(
          Type.Object({
            id: Type.String(),
            name: Type.String(),
            amount: Nullable(Type.Unsafe<Prisma.Decimal>(Type.Number())),
            unit: unitSchema,
            notes: Nullable(Type.String()),
            icon_url: Nullable(Type.String()),
          }),
        ),
      }),
    ),

    instructionGroups: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Nullable(Type.String()),
        instructions: Type.Array(
          Type.Object({
            id: Type.String(),
            text: Type.String(),
          }),
        ),
      }),
    ),

    tags: Type.Array(tagSchema),

    usesRecipes: Type.Optional(Type.Array(Type.String())),
  },
  { $id: recipeSchemaId },
);

export const recipeSchemaRef = Type.Unsafe<Recipe>(Type.Ref(recipeSchemaId));
