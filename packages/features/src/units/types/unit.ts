import { Type, type Static } from '@sinclair/typebox';
import { Nullable } from '../../lib/nullable.js';

export type Unit = Static<typeof unitSchema>;
export const unitSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    createdAt: Type.Unsafe<Date>(Type.String({ format: 'date-time' })),

    name: Type.String(),
    pluralName: Nullable(Type.String()),

    abbreviation: Nullable(Type.String()),
  },
  { $id: 'Unit' },
);

export const unitSchemaRef = Type.Ref(unitSchema);
