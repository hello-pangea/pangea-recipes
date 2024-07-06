import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import {
  createFoodDtoScema,
  foodSchemaRef,
  type Food,
} from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { getFileUrl } from '../../lib/s3.js';
import { noContentSchema } from '../../types/noContent.js';

const routeTag = 'Foods';

export async function foodRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'Create a food',
        body: createFoodDtoScema,
        response: {
          200: Type.Object({
            food: foodSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name, pluralName, iconId } = request.body;

      const isAdmin = request.session?.accessRole === 'admin';

      const food = await prisma.food.create({
        data: {
          name: name,
          pluralName: pluralName ?? null,
          isOfficial: isAdmin,
          icon: iconId
            ? {
                connect: {
                  id: iconId,
                },
              }
            : undefined,
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
      const foods = await prisma.food.findMany({
        include: {
          icon: true,
        },
      });

      const foodsWithIcon: Food[] = foods.map((food) => {
        return {
          ...food,
          iconUrl: food.icon ? getFileUrl(food.icon.key) : undefined,
        };
      });

      return {
        foods: foodsWithIcon,
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
