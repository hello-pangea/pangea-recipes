import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import { toNodeHandler } from 'better-auth/node';
import type { HttpHeader } from 'fastify/types/utils.js';
import { auth } from './betterAuth.ts';

// eslint-disable-next-line @typescript-eslint/require-await
export async function authRoutes(fastify: FastifyTypebox) {
  const authhandler = toNodeHandler(auth);
  fastify.addContentTypeParser(
    'application/json',
    (_request, _payload, done) => {
      done(null, null);
    },
  );
  fastify.all(
    '/auth/*',
    {
      schema: {
        tags: ['X-HIDDEN'],
      },
    },
    async (request, reply) => {
      reply.raw.setHeaders(headersRecordToMap(reply.getHeaders()));

      await authhandler(request.raw, reply.raw);
    },
  );
}

const headersRecordToMap = (
  headers: Record<HttpHeader, string | number | string[] | undefined>,
) => {
  const entries = Object.entries(headers);
  const map = new Map<string, number | string | readonly string[]>();
  for (const [headerKey, headerValue] of entries) {
    if (headerValue != null) {
      map.set(headerKey, headerValue);
    }
  }
  return map;
};
