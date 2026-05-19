import { z } from 'zod';

console.log({
  // @ts-expect-error fjiorefjroie f
  // oxlint-disable-next-line typescript/no-unsafe-assignment typescript/no-unsafe-member-access
  process: process.env,
  meta: import.meta.env,
});

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_GOOGLE_TAG_ID: z.string().optional(),
  VITE_GOOGLE_TAG_CONVERSION_DESTINATION: z.string().optional(),
  PROD: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

export const config = envSchema.parse(import.meta.env);
