import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { foodSchemaRef } from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { noContentSchema } from '../../types/noContent.js';

const routeTag = 'Foods';

export async function foodRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'Create a food',
        body: Type.Object({
          name: Type.String(),
          pluralName: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            food: foodSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name, pluralName } = request.body;

      const food = await prisma.food.create({
        data: {
          name: name,
          pluralName: pluralName ?? null,
        },
      });

      return {
        food: food,
      };
    },
  );

  fastify.get(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'List foods',
        response: {
          200: Type.Object({
            foods: Type.Array(foodSchemaRef),
          }),
        },
      },
    },
    async () => {
      const foods = await prisma.food.findMany({});

      return {
        foods: foods,
      };
    },
  );

  fastify.delete(
    '/:foodId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Delete food',
        params: Type.Object({
          foodId: Type.String(),
        }),
        response: {
          204: noContentSchema,
        },
      },
    },
    async (request, reply) => {
      const { foodId } = request.params;

      await prisma.food.delete({
        where: {
          id: foodId,
        },
      });

      return reply.code(204).send();
    },
  );
}
