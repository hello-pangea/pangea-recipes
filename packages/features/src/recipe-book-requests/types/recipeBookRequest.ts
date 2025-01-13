import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';

const recipeBookRequestSchemaId = 'RecipeBookRequest';

export type RecipeBookRequest = Static<typeof recipeBookRequestSchema>;
export const recipeBookRequestSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    userId: Type.String({ format: 'uuid' }),
    firstName: Type.String(),
    lastName: Nullable(Type.String()),
  },
  { $id: recipeBookRequestSchemaId },
);

export const recipeBookRequestSchemaRef = Type.Unsafe<RecipeBookRequest>(
  Type.Ref(recipeBookRequestSchemaId),
);
