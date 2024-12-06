import { Type, type Static } from '@sinclair/typebox';
import { NumericString, parseEnv } from './configUtils.js';

export type Env = Static<typeof envSchema>;
const envSchema = Type.Object({
  PORT: NumericString,
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
  ]),
  PG_DATABASE_URL: Type.String(),
  CLOUDFLARE_ACCOUNT_ID: Type.String(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: Type.String(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: Type.String(),
  OPENAI_API_KEY: Type.String(),
});

export const config = parseEnv(envSchema, process.env);

export const enablePrettyLogs = process.env.NODE_ENV !== 'production';
