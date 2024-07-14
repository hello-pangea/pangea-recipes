import type { FastifyReply, FastifyRequest } from 'fastify';
import { ApiError } from '../../lib/ApiError.js';
import { verifySession } from './verifySession.js';

export async function verifyIsAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await verifySession(request, reply);

  const isAdmin = request.session?.accessRole === 'admin';

  if (!isAdmin) {
    throw new ApiError({
      statusCode: 403,
      message: 'Forbidden',
      name: 'AuthError',
    });
  }

  return;
}
