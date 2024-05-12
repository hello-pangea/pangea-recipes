import { type Env } from './src/config/config.js';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends Env {}
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    session?: { userId: string; id: string } | null;
  }
}

export {};
