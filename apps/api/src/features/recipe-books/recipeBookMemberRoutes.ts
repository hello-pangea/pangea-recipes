import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import { noContentSchema } from '#src/types/noContent.ts';
import { prisma } from '@open-zero/database';
import { inviteMembersToRecipeBookBodySchema } from '@open-zero/features/recipe-books';
import { Type } from '@sinclair/typebox';
import { verifySession } from '../auth/verifySession.ts';

const routeTag = 'Recipe books';

// eslint-disable-next-line @typescript-eslint/require-await
export async function recipeBookMemberRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '/:recipeBookId/members',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Invite or add new members to a recipe book',
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        body: inviteMembersToRecipeBookBodySchema,
      },
    },
    async (request) => {
      const { recipeBookId } = request.params;
      const { emails, userIds, role } = request.body;

      if (!request.session?.userId) {
        throw new Error('User not found');
      }

      if (!emails && !userIds) {
        throw new Error('Must provide emails or userIds');
      }

      const existingUsers = await prisma.user.findMany({
        where: {
          OR: [
            {
              id: {
                in: userIds,
              },
            },
            {
              email: {
                in: emails,
              },
            },
          ],
        },
      });

      // if (emails) {
      //   const emailsWithNoUser = emails.filter(
      //     (email) => !existingUsers.some((user) => user.emailAddress === email),
      //   );

      //   const signUpUrl =
      //     config.NODE_ENV === 'development'
      //       ? `http://localhost:3000/sign-up`
      //       : `https://hellorecipes.com/sign-up`;

      //   for (const email of emailsWithNoUser) {
      //     const clerkInvite = await clerkClient.invitations.createInvitation({
      //       emailAddress: email,
      //       notify: true,
      //       ignoreExisting: true,
      //       redirectUrl: signUpUrl,
      //     });

      //     await prisma.recipeBookInvite.create({
      //       data: {
      //         recipeBookId: recipeBookId,
      //         inviteeEmailAddress: email,
      //         invitedByUserId: request.session.userId,
      //         role: role,
      //         clerkInviteId: clerkInvite.id,
      //       },
      //     });
      //   }
      // }

      for (const user of existingUsers) {
        await prisma.recipeBookMember.create({
          data: {
            userId: user.id,
            recipeBookId: recipeBookId,
            role: role,
          },
        });
      }

      return null;
    },
  );

  fastify.delete(
    '/:recipeBookId/members/:userId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Delete a member from a recipe book',
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
          userId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: noContentSchema,
        },
      },
    },
    async (request) => {
      const { recipeBookId, userId } = request.params;

      await prisma.recipeBookMember.delete({
        where: {
          userId_recipeBookId: {
            userId: userId,
            recipeBookId: recipeBookId,
          },
        },
      });

      return null;
    },
  );

  fastify.delete(
    '/:recipeBookId/invitations',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Delete an invite from a recipe book',
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        body: Type.Object({
          inviteeEmailAddress: Type.String({ format: 'email' }),
        }),
        response: {
          200: noContentSchema,
        },
      },
    },
    async (request) => {
      const { recipeBookId } = request.params;
      const { inviteeEmailAddress } = request.body;

      await prisma.recipeBookInvite.delete({
        where: {
          inviteeEmailAddress_recipeBookId: {
            recipeBookId: recipeBookId,
            inviteeEmailAddress: inviteeEmailAddress,
          },
        },
      });

      return null;
    },
  );
}
