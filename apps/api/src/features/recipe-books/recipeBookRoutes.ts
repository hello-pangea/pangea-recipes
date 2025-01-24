import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { prisma } from '@open-zero/database';
import {
  createRecipeBookDtoScema,
  recipeBookSchemaRef,
  updateRecipeBookDtoScema,
} from '@open-zero/features/recipe-books';
import { Type } from '@sinclair/typebox';
import { ApiError } from '../../lib/ApiError.js';
import { noContentSchema } from '../../types/noContent.js';
import { verifySession } from '../auth/verifySession.js';
import { mapToRecipeBookDto, recipeBookInclude } from './recipeBookDtoUtils.js';
import { recipeBookMemberRoutes } from './recipeBookMemberRoutes.js';
import { recipeBookRecipeRoutes } from './recipeBookRecipeRoutes.js';

const routeTag = 'Recipe books';

// eslint-disable-next-line @typescript-eslint/require-await
export async function recipeBookRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Create a recipe book',
        body: createRecipeBookDtoScema,
        response: {
          200: Type.Object({
            recipeBook: recipeBookSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name, description } = request.body;

      const userId = request.session?.userId;

      if (!userId) {
        throw fastify.httpErrors.unauthorized();
      }

      const recipeBook = await prisma.recipeBook.create({
        data: {
          name: name,
          description: description ?? null,
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
        querystring: Type.Object({
          userId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            recipeBooks: Type.Array(recipeBookSchemaRef),
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
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            recipeBook: recipeBookSchemaRef,
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

      if (!recipeBook.members.some((member) => member.userId === userId)) {
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
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        body: updateRecipeBookDtoScema,
        response: {
          200: Type.Object({
            recipeBook: recipeBookSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name, description } = request.body;
      const { recipeBookId } = request.params;

      const recipeBook = await prisma.recipeBook.update({
        where: {
          id: recipeBookId,
        },
        data: {
          name: name,
          description: description,
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
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
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
}
