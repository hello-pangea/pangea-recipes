import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';

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
  },
  { $id: recipeBookSchemaId },
);

export const recipeBookSchemaRef = Type.Unsafe<RecipeBook>(
  Type.Ref(recipeBookSchemaId),
);
