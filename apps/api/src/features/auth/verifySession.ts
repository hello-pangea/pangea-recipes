import type { FastifyReply, FastifyRequest } from 'fastify';
import { ApiError } from '../../lib/ApiError.ts';

// oxlint-disable-next-line typescript/require-await
export async function verifySession(request: FastifyRequest, _reply: FastifyReply) {
  const hasSession = Boolean(request.session);

  if (!hasSession) {
    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      name: 'AuthError',
    });
  }

  return;
}
