import { z } from 'zod/v4';

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_GOOGLE_TAG_ID: z.string().optional(),
  VITE_GOOGLE_TAG_CONVERSION_DESTINATION: z.string().optional(),
  PROD: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

export const config = envSchema.parse(import.meta.env);
