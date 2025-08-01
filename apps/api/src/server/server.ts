import { auth } from '#src/features/auth/betterAuth.ts';
import fastifyAuth from '@fastify/auth';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySensible from '@fastify/sensible';
import type { User } from '@repo/features/users';
import { fromNodeHeaders } from 'better-auth/node';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { enablePrettyLogs } from '../config/config.ts';
import { customOpenApi } from './customOpenApi.ts';
import { routes } from './routes.ts';

export async function createServer() {
  console.log('\n🛠️ Setup: fastify server');

  const fastify = Fastify({
    logger: enablePrettyLogs
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : false,
  });

  fastify.setValidatorCompiler(validatorCompiler);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  fastify.setSerializerCompiler(serializerCompiler);

  // -
  // Fastify plugins
  // -

  await fastify.register(cors, {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://pangearecipes.com',
      'https://api.pangearecipes.com',
      'https://next.pangearecipes.com',
    ],
  });

  await fastify.register(helmet);

  await fastify.register(fastifyAuth);

  await fastify.register(fastifySensible);

  await fastify.register(fastifyRateLimit, {
    global: false,
  });

  // -
  // Custom plugins
  // -

  await fastify.register(customOpenApi);

  // -
  // Decorators
  // -

  fastify.decorateRequest('session', null);

  // -
  // Hooks
  // -

  fastify.addHook('onRequest', async (request) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return;
    }

    request.session = {
      userId: session.user.id,
      accessRole: session.user.accessRole as User['accessRole'],
    };
  });

  fastify.setErrorHandler((error, _request, reply) => {
    console.error('Error:', error);

    const statusCode = error.statusCode;

    if (!statusCode || statusCode >= 500 || statusCode < 400) {
      return reply.code(500).send({
        error: 'Internal server error',
        message: 'Something went wrong',
        statusCode: 500,
      });
    } else {
      return reply.code(statusCode).send({
        error: error.name,
        message: error.message,
        statusCode: statusCode,
      });
    }
  });

  // -
  // Services
  // -

  await fastify.register(routes);

  await fastify.ready();
  fastify.swagger();

  return fastify;
}
