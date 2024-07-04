import { Type, type Static } from '@sinclair/typebox';
import { parseEnv } from './configUtils';

export type Env = Static<typeof envSchema>;
const envSchema = Type.Object({
  VITE_API_URL: Type.String(),
  PROD: Type.Boolean(),
});

export const config = parseEnv(envSchema, import.meta.env);
