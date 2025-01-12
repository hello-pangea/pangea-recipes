import { clerkPlugin, getAuth } from '@clerk/fastify';
import auth from '@fastify/auth';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import fastifySensible from '@fastify/sensible';
import openApi from '@fastify/swagger';
import { canonicalIngredientSchema } from '@open-zero/features/canonical-ingredients';
import { recipeSchema } from '@open-zero/features/recipes';
import { recipeBookSchema } from '@open-zero/features/recipes-books';
import { userSchema } from '@open-zero/features/users';
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

  void fastify.register(helmet);

  void fastify.register(auth);

  void fastify.register(fastifySensible);

  void fastify.addSchema(canonicalIngredientSchema);
  void fastify.addSchema(recipeSchema);
  void fastify.addSchema(recipeBookSchema);
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
          name: 'Recipe books',
          description: 'Collections of recipes that you can share with others',
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

  await fastify.register(clerkPlugin, {
    hookName: 'onRequest',
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

  // eslint-disable-next-line @typescript-eslint/require-await
  fastify.addHook('onRequest', async (request) => {
    const { userId: clerkUserId, sessionClaims } = getAuth(request);

    if (!clerkUserId) {
      return;
    }

    if (!sessionClaims.metadata.helloRecipesUserId) {
      return;
    }

    request.session = {
      userId: sessionClaims.metadata.helloRecipesUserId,
      accessRole: sessionClaims.metadata.accessRole ?? 'user',
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

  void fastify.register(routes);

  await fastify.ready();
  fastify.swagger();

  return fastify;
}
