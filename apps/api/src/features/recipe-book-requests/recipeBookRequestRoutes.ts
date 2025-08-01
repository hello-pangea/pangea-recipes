import { resend } from '#src/lib/resend.ts';
import { prisma } from '@open-zero/database';
import { RequestToJoinRecipeBookEmail } from '@open-zero/email';
import {
  acceptRecipeBookRequestContract,
  declineRecipeBookRequestContract,
  listRecipeBookRequestsContract,
  requestAccessToRecipeBookContract,
} from '@open-zero/features/recipe-book-requests';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
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
        ...requestAccessToRecipeBookContract,
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
            from: 'Pangea Recipes <invites@notify.hellorecipes.com>',
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
        ...listRecipeBookRequestsContract,
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
    '/:id/accept',
    {
      schema: {
        tags: [routeTag],
        summary: 'Accept a recipe book request',
        ...acceptRecipeBookRequestContract,
      },
    },
    async (request) => {
      const { id } = request.params;
      const { role } = request.body;

      const recipeBookRequest = await prisma.recipeBookRequest.update({
        where: {
          id: id,
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
    '/:id/decline',
    {
      schema: {
        tags: [routeTag],
        summary: 'Accept a recipe book request',
        ...declineRecipeBookRequestContract,
      },
    },
    async (request) => {
      const { id } = request.params;

      await prisma.recipeBookRequest.update({
        where: {
          id: id,
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
