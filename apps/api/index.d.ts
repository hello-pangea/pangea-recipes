import { type EnvType } from './src/config/config.js';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends EnvType {}
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string } | null;
  }
}

export {};
