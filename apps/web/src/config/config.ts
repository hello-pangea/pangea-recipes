import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export type Env = Static<typeof envSchema>;
export const envSchema = Type.Object({
  VITE_API_URL: Type.String(),
  PROD: Type.Boolean(),
});

export const config = Value.Parse(envSchema, import.meta.env);
