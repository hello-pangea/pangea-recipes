import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import { prisma } from '@open-zero/database';
import { updateUserDtoSchema, userSchemaRef } from '@open-zero/features/users';
import { Type } from '@sinclair/typebox';
import { verifySession } from '../auth/verifySession.ts';

const routeTag = 'Users';

// eslint-disable-next-line @typescript-eslint/require-await
export async function userRoutes(fastify: FastifyTypebox) {
  fastify.get(
    '/:userId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Get a user',
        params: Type.Object({
          userId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            user: userSchemaRef,
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
          200: Type.Object({
            user: Type.Union([userSchemaRef, Type.Null()]),
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
        params: Type.Object({
          userId: Type.String({ format: 'uuid' }),
        }),
        body: updateUserDtoSchema,
        response: {
          200: Type.Object({
            user: userSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { themePreference, unitsPreference, name } = request.body;
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
        },
      });

      return {
        user: user,
      };
    },
  );
}
