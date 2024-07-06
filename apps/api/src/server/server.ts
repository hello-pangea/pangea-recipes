import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import openApi from '@fastify/swagger';
import { foodSchema, recipeSchema, userSchema } from '@open-zero/features';
import scalar from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import { config, enablePrettyLogs } from '../config/config.js';
import { csrfPlugin } from '../lib/csrfPlugin.js';
import { lucia } from '../lib/lucia.js';
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

  void fastify.addSchema(foodSchema);
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
          url: 'http://localhost:3001',
          description: 'Local server',
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
    const sessionId = request.cookies[lucia.sessionCookieName];

    console.log('Auth: sessionId', sessionId);

    if (sessionId) {
      const { session, user } = await lucia.validateSession(sessionId);

      console.log('Auth: session', session);
      console.log('Auth: user', user);

      request.session =
        session && user.id
          ? {
              id: session.id,
              userId: user.id,
              accessRole: user.accessRole,
            }
          : null;

      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();

        void reply.header('set-cookie', sessionCookie.serialize());
      }

      if (session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);

        void reply.header('set-cookie', sessionCookie.serialize());
      }
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
