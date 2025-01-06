import { type User } from '@open-zero/features/users';
import { type Env } from './src/config/config.js';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends Env {}
  }

  interface CustomJwtSessionClaims {
    metadata: {
      helloRecipesUserId?: string;
      accessRole?: User['accessRole'];
    };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    session?: {
      userId: string;
      accessRole: User['accessRole'];
    } | null;
  }
}

export {};
