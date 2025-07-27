import { resend } from '#src/lib/resend.ts';
import { noContentSchema } from '#src/types/noContent.ts';
import { prisma } from '@open-zero/database';
import { RequestToJoinRecipeBookEmail } from '@open-zero/email';
import { recipeBookRequestSchema } from '@open-zero/features/recipe-book-requests';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { verifySession } from '../auth/verifySession.ts';

const routeTag = 'Recipe book requests';

// eslint-disable-next-line @typescript-eslint/require-await
export const recipeBookRequestRoutes: FastifyPluginAsyncZod = async function (
  fastify,
) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Request access to a recipe book',
        description:
          'Uses the auth token in the request to determin who is making the request.',
        body: z.object({
          recipeBookId: z.uuidv4(),
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
                  email: true,
                  name: true,
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
          name: true,
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
          await resend.emails.send({
            from: 'Hello Recipes <invites@notify.hellorecipes.com>',
            to: owner.user.email,
            subject: `Share request for recipe book`,
            replyTo: 'hello@hellorecipes.com',
            react: RequestToJoinRecipeBookEmail({
              ownerName: owner.user.name || undefined,
              requesterName: requestingUser.name || 'Guest',
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
        querystring: z.object({
          recipeBookId: z.uuidv4(),
          userId: z.uuidv4(),
        }),
        response: {
          200: z.object({
            recipeBookRequests: z.array(recipeBookRequestSchema),
          }),
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
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        recipeBookRequests: recipeBookRequest
          ? [{ ...recipeBookRequest, name: recipeBookRequest.user.name }]
          : [],
      };
    },
  );

  fastify.post(
    '/:recipeBookRequestId/accept',
    {
      schema: {
        tags: [routeTag],
        summary: 'Accept a recipe book request',
        params: z.object({
          recipeBookRequestId: z.uuidv4(),
        }),
        body: z.object({
          role: z.enum(['owner', 'editor', 'viewer']),
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
        params: z.object({
          recipeBookRequestId: z.uuidv4(),
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
};
