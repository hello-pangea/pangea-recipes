import { prisma } from '@open-zero/database';
import {
  getSignedInUserContract,
  getUserContract,
  updateUserContract,
} from '@open-zero/features/users';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { verifySession } from '../auth/verifySession.ts';

const routeTag = 'Users';

// eslint-disable-next-line @typescript-eslint/require-await
export const userRoutes: FastifyPluginAsyncZod = async function (fastify) {
  fastify.get(
    '/:id',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Get a user',
        ...getUserContract,
      },
    },
    async (request) => {
      const { id } = request.params;

      if (id !== request.session?.userId) {
        throw fastify.httpErrors.forbidden();
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });

      return {
        user: user,
      };
    },
  );

  fastify.get(
    '/signed-in-user',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get currently signed in user',
        ...getSignedInUserContract,
      },
    },
    async (request) => {
      const userId = request.session?.userId;

      if (!userId) {
        return {
          user: null,
        };
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      return {
        user: user,
      };
    },
  );

  fastify.patch(
    '/:id',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Update a user',
        ...updateUserContract,
      },
    },
    async (request) => {
      const { themePreference, unitsPreference, name, accentColor } =
        request.body;
      const { id } = request.params;

      if (id !== request.session?.userId) {
        throw fastify.httpErrors.forbidden();
      }

      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          themePreference: themePreference,
          unitsPreference: unitsPreference,
          name: name,
          accentColor: accentColor,
        },
      });

      return {
        user: user,
      };
    },
  );
};
