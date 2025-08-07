import { z } from 'zod/v4';

export const userSchema = z
  .object({
    id: z.uuidv4(),

    createdAt: z.coerce.date(),

    name: z.string(),

    email: z.string(),
    emailVerified: z.boolean(),

    image: z.string().nullable(),

    accessRole: z.enum(['admin', 'user']),

    themePreference: z.enum(['light', 'dark', 'system']),

    unitsPreference: z.enum(['imperial', 'metric']),

    accentColor: z.enum([
      'red',
      'orange',
      'amber',
      'yellow',
      'lime',
      'green',
      'emerald',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuschia',
      'pink',
      'rose',
    ]),
  })
  .meta({
    id: 'User',
  });

export type User = z.infer<typeof userSchema>;
