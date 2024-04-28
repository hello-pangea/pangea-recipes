import { z } from 'zod';

const envSchema = z.object({
  PORT: z.number().default(3001),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PG_DATABASE_URL: z.string().trim().min(1),

  JWT_SECRET: z.string().trim().min(1),
  COOKIE_SECRET: z.string().trim().min(1),
});

const envParser = envSchema.safeParse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  PG_DATABASE_URL: process.env.PG_DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
});

if (!envParser.success) {
  console.error(envParser.error.issues);
  throw new Error('There is an error with the server environment variables');
}

export const env = envParser.data;
export type EnvType = z.infer<typeof envSchema>;

export const enablePrettyLogs = process.env.NODE_ENV !== 'production';
