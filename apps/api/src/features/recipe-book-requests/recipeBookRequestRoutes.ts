import { prisma } from '#src/lib/prisma.js';
import { resend } from '#src/lib/resend.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { noContentSchema } from '#src/types/noContent.js';
import { RequestToJoinRecipeBookEmail } from '@open-zero/email';
import { recipeBookRequestSchemaRef } from '@open-zero/features/recipe-book-requests';
import { Type } from '@sinclair/typebox';
import { verifySession } from '../auth/verifySession.js';

const routeTag = 'Recipe book requests';

// eslint-disable-next-line @typescript-eslint/require-await
export async function recipeBookRequestRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Request access to a recipe book',
        description:
          'Uses the auth token in the request to determin who is making the request.',
        body: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: noContentSchema,
        },
      },
    },
    async (request) => {
      const { recipeBookId } = request.body;

      const userId = request.session?.userId;

      if (!userId) {
        throw fastify.httpErrors.unauthorized();
      }

      const recipeBook = await prisma.recipeBook.findUniqueOrThrow({
        where: {
          id: recipeBookId,
        },
        include: {
          requests: true,
          members: {
            where: {
              role: 'owner',
            },
            include: {
              user: {
                select: {
                  emailAddress: true,
                  firstName: true,
                },
              },
            },
          },
        },
      });

      const alreadyRequested = recipeBook.requests.some(
        (request) => request.userId === userId,
      );

      if (alreadyRequested) {
        throw fastify.httpErrors.conflict();
      }

      const requestingUser = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          firstName: true,
          lastName: true,
        },
      });

      await prisma.recipeBookRequest.create({
        data: {
          recipeBookId: recipeBookId,
          userId: userId,
        },
      });

      const recipeBookOwners = recipeBook.members.filter(
        (member) => member.role === 'owner',
      );

      if (recipeBookOwners.length) {
        for (const owner of recipeBookOwners) {
          if (!owner.user.emailAddress) {
            continue;
          }

          await resend.emails.send({
            from: 'Hello Recipes <invites@notify.hellorecipes.com>',
            to: owner.user.emailAddress,
            subject: `Share request for recipe book`,
            replyTo: 'hello@hellorecipes.com',
            react: RequestToJoinRecipeBookEmail({
              ownerName: owner.user.firstName,
              requesterName: `${requestingUser.firstName}${requestingUser.lastName ? ` ${requestingUser.lastName}` : ''}`,
              managerLink: `https://hellorecipes.com/recipe-books/${recipeBookId}`,
              recipeBookName: recipeBook.name,
            }),
          });
        }
      }

      return null;
    },
  );

  fastify.get(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'List recipe book requests',
        description:
          'For privacy reasons, the user can only check for requests that they made.',
        querystring: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
          userId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: {
            recipeBookRequests: Type.Array(recipeBookRequestSchemaRef),
          },
        },
      },
    },
    async (request) => {
      const { userId, recipeBookId } = request.query;

      if (request.session?.userId !== userId) {
        throw fastify.httpErrors.forbidden();
      }

      const recipeBookRequest = await prisma.recipeBookRequest.findFirst({
        where: {
          recipeBookId: recipeBookId,
          userId: userId,
          acceptedAt: null,
          declinedAt: null,
        },
      });

      return {
        recipeBookRequests: recipeBookRequest ? [recipeBookRequest] : [],
      };
    },
  );

  fastify.post(
    '/:recipeBookRequestId/accept',
    {
      schema: {
        tags: [routeTag],
        summary: 'Accept a recipe book request',
        params: Type.Object({
          recipeBookRequestId: Type.String({ format: 'uuid' }),
        }),
        body: Type.Object({
          role: Type.Union([
            Type.Literal('owner'),
            Type.Literal('editor'),
            Type.Literal('viewer'),
          ]),
        }),
        response: {
          200: noContentSchema,
        },
      },
    },
    async (request) => {
      const { recipeBookRequestId } = request.params;
      const { role } = request.body;

      const recipeBookRequest = await prisma.recipeBookRequest.update({
        where: {
          id: recipeBookRequestId,
          acceptedAt: null,
          declinedAt: null,
        },
        data: {
          acceptedAt: new Date(),
        },
      });

      await prisma.recipeBookMember.create({
        data: {
          recipeBookId: recipeBookRequest.recipeBookId,
          userId: recipeBookRequest.userId,
          role,
        },
      });

      return null;
    },
  );

  fastify.post(
    '/:recipeBookRequestId/decline',
    {
      schema: {
        tags: [routeTag],
        summary: 'Accept a recipe book request',
        params: Type.Object({
          recipeBookRequestId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: noContentSchema,
        },
      },
    },
    async (request) => {
      const { recipeBookRequestId } = request.params;

      await prisma.recipeBookRequest.update({
        where: {
          id: recipeBookRequestId,
          acceptedAt: null,
          declinedAt: null,
        },
        data: {
          declinedAt: new Date(),
        },
      });

      return null;
    },
  );
}
