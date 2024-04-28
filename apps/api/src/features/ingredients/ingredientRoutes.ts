import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { ingredientSchemaRef } from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { noContentSchema } from '../../types/noContent.js';

const routeTag = 'Ingredients';

export async function ingredientRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'Create an ingredient',
        body: Type.Object({
          name: Type.String(),
          pluralName: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            ingredient: ingredientSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name, pluralName } = request.body;

      const ingredient = await prisma.ingredient.create({
        data: {
          name: name,
          pluralName: pluralName ?? null,
        },
      });

      return {
        ingredient: ingredient,
      };
    },
  );

  fastify.get(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'List ingredients',
        response: {
          200: Type.Object({
            ingredients: Type.Array(ingredientSchemaRef),
          }),
        },
      },
    },
    async () => {
      const ingredients = await prisma.ingredient.findMany({});

      return {
        ingredients: ingredients,
      };
    },
  );

  fastify.delete(
    '/:ingredientId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Delete ingredient',
        params: Type.Object({
          ingredientId: Type.String(),
        }),
        response: {
          204: noContentSchema,
        },
      },
    },
    async (request, reply) => {
      const { ingredientId } = request.params;

      await prisma.ingredient.delete({
        where: {
          id: ingredientId,
        },
      });

      return reply.code(204).send();
    },
  );
}
