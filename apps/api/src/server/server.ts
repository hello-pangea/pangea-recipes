import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import openApi from '@fastify/swagger';
import {
  foodSchema,
  recipeSchema,
  unitSchema,
  userSchema,
} from '@open-zero/features';
import scalar from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import { enablePrettyLogs } from '../config/config.js';
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
  });

  fastify.decorateRequest('session', null);

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
  void fastify.addSchema(unitSchema);
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await fastify.register(scalar, {
    routePrefix: '/api-docs',
  });

  fastify.addHook('onRequest', async (request, reply) => {
    const originHeader = request.headers.origin;
    const hostHeader = request.headers.host;

    console.log('Auth: originHeader', originHeader);
    console.log('Auth: hostHeader', hostHeader);

    // if (
    //   !originHeader ||
    //   !hostHeader ||
    //   !verifyRequestOrigin(originHeader, [hostHeader])
    // ) {
    //   return new Response(null, {
    //     status: 403,
    //   });
    // }

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

  void fastify.register(routes);

  await fastify.ready();
  fastify.swagger();

  return fastify;
}
