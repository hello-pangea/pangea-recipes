import { prisma } from '@open-zero/database';
import {
  createRecipeBookDtoScema,
  recipeBookSchema,
  updateRecipeBookDtoScema,
} from '@open-zero/features/recipe-books';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { ApiError } from '../../lib/ApiError.ts';
import { noContentSchema } from '../../types/noContent.ts';
import { verifySession } from '../auth/verifySession.ts';
import { mapToRecipeBookDto, recipeBookInclude } from './recipeBookDtoUtils.ts';
import { recipeBookMemberRoutes } from './recipeBookMemberRoutes.ts';
import { recipeBookRecipeRoutes } from './recipeBookRecipeRoutes.ts';

const routeTag = 'Recipe books';

// eslint-disable-next-line @typescript-eslint/require-await
export const recipeBookRoutes: FastifyPluginAsyncZod = async function (
  fastify,
) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Create a recipe book',
        body: createRecipeBookDtoScema,
        response: {
          200: z.object({
            recipeBook: recipeBookSchema,
          }),
        },
      },
    },
    async (request) => {
      const { name, description, access } = request.body;

      const userId = request.session?.userId;

      if (!userId) {
        throw fastify.httpErrors.unauthorized();
      }

      const recipeBook = await prisma.recipeBook.create({
        data: {
          name: name,
          description: description ?? null,
          access: access ?? 'public',
          members: {
            create: {
              userId: userId,
              role: 'owner',
            },
          },
        },
        include: recipeBookInclude,
      });

      return {
        recipeBook: mapToRecipeBookDto(recipeBook),
      };
    },
  );

  fastify.get(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'List recipe books',
        querystring: z.object({
          userId: z.uuidv4(),
        }),
        response: {
          200: z.object({
            recipeBooks: z.array(recipeBookSchema),
          }),
        },
      },
    },
    async (request) => {
      const { userId } = request.query;

      if (userId !== request.session?.userId) {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

      const recipeBooks = await prisma.recipeBook.findMany({
        where: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
        include: recipeBookInclude,
      });

      return {
        recipeBooks: recipeBooks.map(mapToRecipeBookDto),
      };
    },
  );

  fastify.get(
    '/:recipeBookId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get a recipe book',
        params: z.object({
          recipeBookId: z.uuidv4(),
        }),
        response: {
          200: z.object({
            recipeBook: recipeBookSchema,
          }),
        },
      },
    },
    async (request) => {
      const { recipeBookId } = request.params;

      const userId = request.session?.userId;

      if (!userId) {
        throw fastify.httpErrors.unauthorized();
      }

      const recipeBook = await prisma.recipeBook.findUniqueOrThrow({
        where: {
          id: recipeBookId,
        },
        include: recipeBookInclude,
      });

      if (
        recipeBook.access !== 'public' &&
        !recipeBook.members.some((member) => member.userId === userId)
      ) {
        throw fastify.httpErrors.forbidden();
      }

      return {
        recipeBook: mapToRecipeBookDto(recipeBook),
      };
    },
  );

  fastify.patch(
    '/:recipeBookId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Update a recipe book',
        params: z.object({
          recipeBookId: z.uuidv4(),
        }),
        body: updateRecipeBookDtoScema,
        response: {
          200: z.object({
            recipeBook: recipeBookSchema,
          }),
        },
      },
    },
    async (request) => {
      const { name, description, access } = request.body;
      const { recipeBookId } = request.params;

      const recipeBook = await prisma.recipeBook.update({
        where: {
          id: recipeBookId,
        },
        data: {
          name: name,
          description: description,
          access: access,
        },
        include: recipeBookInclude,
      });

      return {
        recipeBook: mapToRecipeBookDto(recipeBook),
      };
    },
  );

  fastify.delete(
    '/:recipeBookId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Delete a recipe',
        params: z.object({
          recipeBookId: z.uuidv4(),
        }),
        response: {
          204: noContentSchema,
        },
      },
    },
    async (request, reply) => {
      const { recipeBookId } = request.params;

      const recipeBook = await prisma.recipeBook.findUniqueOrThrow({
        where: {
          id: recipeBookId,
        },
        include: {
          members: {
            select: {
              userId: true,
              role: true,
            },
          },
        },
      });

      const memberRole = recipeBook.members.find(
        (member) => member.userId === request.session?.userId,
      )?.role;

      if (!memberRole || memberRole !== 'owner') {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

      await prisma.recipeBook.delete({
        where: {
          id: recipeBookId,
        },
      });

      return reply.code(204).send();
    },
  );

  fastify.register(recipeBookRecipeRoutes);
  fastify.register(recipeBookMemberRoutes);
};
