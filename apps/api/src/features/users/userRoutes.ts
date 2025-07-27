import { prisma } from '@open-zero/database';
import { updateUserDtoSchema, userSchema } from '@open-zero/features/users';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { verifySession } from '../auth/verifySession.ts';

const routeTag = 'Users';

// eslint-disable-next-line @typescript-eslint/require-await
export const userRoutes: FastifyPluginAsyncZod = async function (fastify) {
  fastify.get(
    '/:userId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Get a user',
        params: z.object({
          userId: z.uuidv4(),
        }),
        response: {
          200: z.object({
            user: userSchema,
          }),
        },
      },
    },
    async (request) => {
      const { userId } = request.params;

      if (userId !== request.session?.userId) {
        throw fastify.httpErrors.forbidden();
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

  fastify.get(
    '/signed-in-user',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get currently signed in user',
        response: {
          200: z.object({
            user: z.union([userSchema, z.null()]),
          }),
        },
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
    '/:userId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Update a user',
        params: z.object({
          userId: z.uuidv4(),
        }),
        body: updateUserDtoSchema,
        response: {
          200: z.object({
            user: userSchema,
          }),
        },
      },
    },
    async (request) => {
      const { themePreference, unitsPreference, name, accentColor } =
        request.body;
      const { userId } = request.params;

      if (userId !== request.session?.userId) {
        throw fastify.httpErrors.forbidden();
      }

      const user = await prisma.user.update({
        where: {
          id: userId,
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
