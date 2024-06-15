import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import {
  signInUserDtoSchema,
  signUpUserDtoSchema,
  userSchemaRef,
} from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { randomBytes, randomUUID, scryptSync } from 'node:crypto';
import { lucia } from '../../lib/lucia.js';
import { noContentSchema } from '../../types/noContent.js';

const routeTag = 'Users';

export async function userRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '/sign-up',
    {
      schema: {
        tags: [routeTag],
        summary: 'Sign up a new user',
        body: signUpUserDtoSchema,
        response: {
          200: Type.Object({
            user: userSchemaRef,
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const salt = randomBytes(16).toString('hex');
      const normalizedPassword = password.normalize('NFKC');

      const hashedPassword = scryptSync(normalizedPassword, salt, 64).toString(
        'hex',
      );

      const hashedPasswordAndSalt = `${salt}:${hashedPassword}`;

      const user = await prisma.user.create({
        data: {
          email: email,
          name: name,
          hashedPassword: hashedPasswordAndSalt,
        },
      });

      const session = await lucia.createSession(
        user.id,
        {},
        {
          sessionId: randomUUID(),
        },
      );

      const sessionCookie = lucia.createSessionCookie(session.id);
      void reply.header('set-cookie', sessionCookie.serialize());

      const { hashedPassword: _, ...sanitizedUser } = user;

      return { user: sanitizedUser };
    },
  );

  fastify.post(
    '/sign-in',
    {
      schema: {
        tags: [routeTag],
        summary: 'Sign in an existing user',
        body: signInUserDtoSchema,
        response: {
          200: Type.Object({
            user: userSchemaRef,
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      const hashedPasswordAndSalt = user?.hashedPassword ?? 'salt:password';

      const [salt, hashedPassword] = hashedPasswordAndSalt.split(':');

      if (!salt || !hashedPassword) {
        throw new Error();
      }

      const newNormalizedPassword = password.normalize('NFKC');

      const newHashedPassword = scryptSync(
        newNormalizedPassword,
        salt,
        64,
      ).toString('hex');

      const isValidPassword = newHashedPassword === hashedPassword;

      if (!isValidPassword || !user) {
        throw new Error();
      }

      const session = await lucia.createSession(
        user.id,
        {},
        {
          sessionId: randomUUID(),
        },
      );

      const sessionCookie = lucia.createSessionCookie(session.id);
      void reply.header('set-cookie', sessionCookie.serialize());

      const { hashedPassword: _, ...sanitizedUser } = user;

      return { user: sanitizedUser };
    },
  );

  fastify.post(
    '/sign-out',
    {
      schema: {
        tags: [routeTag],
        summary: 'Sign out current user',
        description:
          'Invalidates the current session and clears the session cookie.',
        response: {
          204: noContentSchema,
        },
      },
    },
    async (request, reply) => {
      const { session } = request;

      if (!session) {
        return reply.code(204).send();
      }

      await lucia.invalidateSession(session.id);

      const blankSessionCookie = lucia.createBlankSessionCookie();
      void reply.header('set-cookie', blankSessionCookie.serialize());

      return reply.code(204).send();
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
}
