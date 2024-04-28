import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import openApi from '@fastify/swagger';
import { ingredientSchema, unitSchema, userSchema } from '@open-zero/features';
import scalar from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import { enablePrettyLogs } from '../config/config.js';
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

  void fastify.addSchema(ingredientSchema);
  void fastify.addSchema(unitSchema);
  void fastify.addSchema(userSchema);

  void fastify.register(openApi, {
    openapi: {
      info: {
        title: 'Hello Recipes',
        description: 'A recipe management app by Open Zero',
        version: '1.0.0',
      },
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

  void fastify.register(routes);

  await fastify.ready();
  fastify.swagger();

  return fastify;
}
