import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { clerkClient, getAuth } from '@clerk/fastify';
import {
  setupUserDtoSchema,
  updateUserDtoSchema,
  userSchemaRef,
} from '@open-zero/features/users';
import { Type } from '@sinclair/typebox';
import { ApiError } from '../../lib/ApiError.js';
import { verifySession } from '../auth/verifySession.js';

const routeTag = 'Users';

// eslint-disable-next-line @typescript-eslint/require-await
export async function userRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '/setup',
    {
      schema: {
        tags: [routeTag],
        summary: 'Setup a new user after Clerk auth',
        body: setupUserDtoSchema,
        response: {
          200: Type.Object({
            user: userSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name } = request.body;
      const { userId: clerkUserId } = getAuth(request);

      if (!clerkUserId) {
        throw new ApiError({
          statusCode: 401,
          message: 'Unauthorized',
          name: 'AuthError',
        });
      }

      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      const user = await prisma.user.upsert({
        where: {
          clerkUserId: clerkUserId,
        },
        create: {
          emailAddress: clerkUser.primaryEmailAddress?.emailAddress ?? null,
          phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber ?? null,
          name: name ?? clerkUser.fullName,
          accessRole: 'user',
          clerkUserId: clerkUserId,
        },
        update: {},
      });

      await clerkClient.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          helloRecipesUserId: user.id,
          accessRole: user.accessRole,
        },
      });

      return { user: user };
    },
  );

  fastify.get(
    '/:userId',
    {
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
      const { themePreference } = request.body;
      const { userId } = request.params;

      if (userId !== request.session?.userId) {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          themePreference: themePreference,
        },
      });

      return {
        user: user,
      };
    },
  );
}
