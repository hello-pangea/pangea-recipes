import { type User } from '@repo/features/users';
import { type Env } from './src/config/config.js';

declare global {
  namespace NodeJS {
    // oxlint-disable-next-line typescript/no-empty-object-type
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
