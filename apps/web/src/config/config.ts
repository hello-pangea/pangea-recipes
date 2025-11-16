import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_GOOGLE_TAG_ID: z.string().optional(),
  VITE_GOOGLE_TAG_CONVERSION_DESTINATION: z.string().optional(),
  PROD: z.boolean().catch(false),
});

export type Env = z.infer<typeof envSchema>;

console.log('envs 1', import.meta.env);
console.log('envs 2', process.env);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const config = envSchema.parse(
  import.meta.env['VITE_API_URL'] ? import.meta.env : process.env,
);
