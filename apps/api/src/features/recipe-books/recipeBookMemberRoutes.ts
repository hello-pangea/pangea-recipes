import { config } from '#src/config/config.ts';
import { resend } from '#src/lib/resend.ts';
import { prisma } from '@open-zero/database';
import { InviteToRecipeBook } from '@open-zero/email';
import {
  deleteRecipeBookInviteContract,
  deleteRecipeBookMemberContract,
  inviteMembersToRecipeBookContract,
} from '@open-zero/features/recipe-books';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { verifySession } from '../auth/verifySession.ts';

const routeTag = 'Recipe books';

// eslint-disable-next-line @typescript-eslint/require-await
export const recipeBookMemberRoutes: FastifyPluginAsyncZod = async function (
  fastify,
) {
  fastify.post(
    '/:id/members',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Invite or add new members to a recipe book',
        ...inviteMembersToRecipeBookContract,
      },
    },
    async (request) => {
      const { id } = request.params;
      const { emails, userIds, role } = request.body;

      if (!request.session?.userId) {
        throw new Error('User not found');
      }

      if (!emails && !userIds) {
        throw new Error('Must provide emails or userIds');
      }

      const recipeBook = await prisma.recipeBook.findUniqueOrThrow({
        where: {
          id: id,
        },
      });

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

      if (emails) {
        const emailsWithNoUser = emails.filter(
          (email) => !existingUsers.some((user) => user.email === email),
        );

        const signUpUrl =
          config.NODE_ENV === 'development'
            ? `http://localhost:3000/sign-up`
            : `https://pangearecipes.com/sign-up`;

        for (const email of emailsWithNoUser) {
          await resend.emails.send({
            from: 'Pangea Recipes <invites@notify.pangearecipes.com>',
            to: email,
            subject: `You've been invited to join a recipe book on Pangea Recipes`,
            replyTo: 'hello@pangearecipes.com',
            react: InviteToRecipeBook({
              url: signUpUrl,
              recipeBookName: recipeBook.name,
            }),
          });

          await prisma.recipeBookInvite.create({
            data: {
              recipeBookId: id,
              inviteeEmail: email,
              invitedByUserId: request.session.userId,
              role: role,
            },
          });
        }
      }

      for (const user of existingUsers) {
        await prisma.recipeBookMember.create({
          data: {
            userId: user.id,
            recipeBookId: id,
            role: role,
          },
        });
      }

      return null;
    },
  );

  fastify.delete(
    '/:id/members/:userId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Delete a member from a recipe book',
        ...deleteRecipeBookMemberContract,
      },
    },
    async (request) => {
      const { id, userId } = request.params;

      await prisma.recipeBookMember.delete({
        where: {
          userId_recipeBookId: {
            userId: userId,
            recipeBookId: id,
          },
        },
      });

      return null;
    },
  );

  fastify.delete(
    '/:id/invitations',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Delete an invite from a recipe book',
        ...deleteRecipeBookInviteContract,
      },
    },
    async (request) => {
      const { id } = request.params;
      const { inviteeEmail } = request.body;

      await prisma.recipeBookInvite.delete({
        where: {
          inviteeEmail_recipeBookId: {
            recipeBookId: id,
            inviteeEmail: inviteeEmail,
          },
        },
      });

      return null;
    },
  );
};
