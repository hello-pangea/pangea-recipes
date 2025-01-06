import { type User } from '@open-zero/features/users';
import { type Env } from './src/config/config.js';

interface ImportMetaEnv extends Env {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface UserPublicMetadata {
    helloRecipesUserId?: string;
    accessRole?: User['accessRole'];
  }
}
