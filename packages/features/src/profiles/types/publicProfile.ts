import { z } from 'zod';

export const publicProfileSchema = z
  .object({
    id: z.uuidv4(),

    name: z.string(),

    image: z.string().nullable(),
  })
  .meta({
    id: 'PublicProfile',
  });

export type PublicProfile = z.infer<typeof publicProfileSchema>;
