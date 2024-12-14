import { validateSessionToken } from '#src/features/auth/session.js';
import auth from '@fastify/auth';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import openApi from '@fastify/swagger';
import {
  canonicalIngredientSchema,
  recipeSchema,
  userSchema,
} from '@open-zero/features';
import scalar from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import { config, enablePrettyLogs } from '../config/config.js';
import { csrfPlugin } from '../features/auth/csrfPlugin.js';
import { routes } from './routes.js';

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
    ajv: {
      // Adds the file plugin to help @fastify/swagger schema generation
      plugins: [multipart.ajvFilePlugin],
    },
  });

  // -
  // Fastify plugins
  // -

  void fastify.register(cors, {
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://hellorecipes.com',
      'https://api.hellorecipes.com',
    ],
  });

  void fastify.register(cookie, {
    secret: 'my-secret', // for cookies signature
    hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    parseOptions: {}, // options for parsing cookies
  });

  void fastify.register(helmet);

  void fastify.register(auth);

  void fastify.addSchema(canonicalIngredientSchema);
  void fastify.addSchema(recipeSchema);
  void fastify.addSchema(userSchema);

  void fastify.register(openApi, {
    openapi: {
      info: {
        title: 'Hello Recipes',
        description: 'A recipe management app by Open Zero',
        version: '1.0.0',
      },
      tags: [
        {
          name: 'Foods',
          description: 'Food related endpoints',
        },
        {
          name: 'Recipes',
          description: 'Recipe related endpoints',
        },
        {
          name: 'Units',
          description: 'Unit related endpoints',
        },
        {
          name: 'Users',
          description: 'User related endpoints',
        },
        {
          name: 'Imported recipes',
          description: 'Import recipes from other websites',
        },
      ],
      servers: [
        {
          url: 'https://api.hellorecipes.com',
          description: 'Production',
        },
        {
          url: 'http://localhost:3001',
          description: 'Local',
        },
      ],
    },
  });

  // -
  // Custom plugins
  // -

  void fastify.register(csrfPlugin, {
    enabled: config.NODE_ENV === 'production',
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await fastify.register(scalar, {
    routePrefix: '/api-docs',
  });

  // -
  // Decorators
  // -

  fastify.decorateRequest('session', null);

  // -
  // Hooks
  // -

  fastify.addHook('onRequest', async (request, reply) => {
    const token = request.cookies['auth_session'];

    if (token) {
      const { session, user } = await validateSessionToken(token);

      request.session =
        session && user.id
          ? {
              id: session.id,
              userId: user.id,
              accessRole: user.accessRole,
            }
          : null;

      if (!session) {
        reply.clearCookie('auth_session');
      } else {
        reply.setCookie('auth_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    }
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

  void fastify.register(routes);

  await fastify.ready();
  fastify.swagger();

  return fastify;
}
