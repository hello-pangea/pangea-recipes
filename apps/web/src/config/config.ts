import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_GOOGLE_TAG_ID: z.string().optional(),
  VITE_GOOGLE_TAG_CONVERSION_DESTINATION: z.string().optional(),
  PROD: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

export const config = envSchema.parse({
  VITE_API_URL: import.meta.env['VITE_API_URL'],
  VITE_GOOGLE_TAG_ID: import.meta.env['VITE_GOOGLE_TAG_ID'],
  VITE_GOOGLE_TAG_CONVERSION_DESTINATION: import.meta.env['VITE_GOOGLE_TAG_CONVERSION_DESTINATION'],
  PROD: import.meta.env.PROD,
});
