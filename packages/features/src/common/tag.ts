import { z } from 'zod/v4';

export const tagSchema = z.object({
  id: z.uuidv4().describe('unique id'),
  name: z.string().min(1),
});

export type Tag = z.infer<typeof tagSchema>;

export const createTagDtoSchema = z.object({
  name: z.string().min(1),
});

export type CreateTagDto = z.infer<typeof createTagDtoSchema>;
