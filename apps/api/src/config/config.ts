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
});

export const env = parseEnv(envSchema, process.env);

export const enablePrettyLogs = process.env.NODE_ENV !== 'production';
