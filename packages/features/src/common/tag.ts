import { Type, type Static } from '@sinclair/typebox';

export type Tag = Static<typeof tagSchema>;
export const tagSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'unique id',
    }),

    name: Type.String({ minLength: 1 }),
  },
  { $id: 'Tag' },
);

export type CreateTagDto = Static<typeof createTagDtoSchema>;
export const createTagDtoSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
});
