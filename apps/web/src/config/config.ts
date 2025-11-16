import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_GOOGLE_TAG_ID: z.string().optional(),
  VITE_GOOGLE_TAG_CONVERSION_DESTINATION: z.string().optional(),
  PROD: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const config = envSchema.parse(import.meta.env ?? process.env);
