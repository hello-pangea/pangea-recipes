import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import {
  createRecipeBookDtoScema,
  recipeBookSchemaRef,
  updateRecipeBookDtoScema,
} from '@open-zero/features/recipes-books';
import { Type } from '@sinclair/typebox';
import { ApiError } from '../../lib/ApiError.js';
import { noContentSchema } from '../../types/noContent.js';
import { verifySession } from '../auth/verifySession.js';

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
        throw new Error('User not authenticated');
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
        include: {
          members: {
            select: {
              userId: true,
              role: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        recipeBook: recipeBook,
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
        include: {
          members: {
            select: {
              userId: true,
              role: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        recipeBooks: recipeBooks,
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

      const recipeBook = await prisma.recipeBook.findUniqueOrThrow({
        where: {
          id: recipeBookId,
        },
        include: {
          members: {
            select: {
              userId: true,
              role: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        recipeBook: recipeBook,
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
        include: {
          members: {
            select: {
              userId: true,
              role: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        recipeBook: recipeBook,
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

  fastify.post(
    '/:recipeBookId/recipes',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Add a recipe to a recipe book',
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        body: Type.Object({
          recipeId: Type.String({ format: 'uuid' }),
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
      const { recipeId } = request.body;

      const recipeBook = await prisma.recipeBook.update({
        where: {
          id: recipeBookId,
        },
        data: {
          recipes: {
            create: {
              recipe: {
                connect: {
                  id: recipeId,
                },
              },
            },
          },
        },
        include: {
          members: {
            select: {
              userId: true,
              role: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        recipeBook: recipeBook,
      };
    },
  );

  fastify.delete(
    '/:recipeBookId/recipes/:recipeId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Remove a recipe from a recipe book',
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        body: Type.Object({
          recipeId: Type.String({ format: 'uuid' }),
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
      const { recipeId } = request.body;

      const recipeBook = await prisma.recipeBook.update({
        where: {
          id: recipeBookId,
        },
        data: {
          recipes: {
            deleteMany: {
              recipeId: recipeId,
            },
          },
        },
        include: {
          members: {
            select: {
              userId: true,
              role: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        recipeBook: recipeBook,
      };
    },
  );
}
