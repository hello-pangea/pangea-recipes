import { type Env } from './src/config/config.js';

interface ImportMetaEnv extends Env {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
