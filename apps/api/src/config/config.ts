import { z } from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production']),
  PG_DATABASE_URL: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
  PUBLIC_BUCKET_NAME: z.string(),
  PUBLIC_BUCKET_DOMAIN: z.string(),
  PRIVATE_BUCKET_NAME: z.string(),
  OPENAI_API_KEY: z.string(),
  RESEND_SECRET_KEY: z.string(),
  SENTRY_DSN: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  FACEBOOK_APP_ID: z.string(),
  FACEBOOK_APP_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const config = envSchema.parse(process.env);

export const enablePrettyLogs = process.env.NODE_ENV !== 'production';
