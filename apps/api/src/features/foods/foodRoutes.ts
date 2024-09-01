import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import {
  createFoodDtoScema,
  foodSchemaRef,
  updateFoodDtoSchema,
  type Food,
} from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { ApiError } from '../../lib/ApiError.js';
import { getFileUrl } from '../../lib/s3.js';
import { noContentSchema } from '../../types/noContent.js';
import { verifyIsAdmin } from '../auth/verifyIsAdmin.js';
import { verifySession } from '../auth/verifySession.js';

const routeTag = 'Foods';

// eslint-disable-next-line @typescript-eslint/require-await
export async function foodRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
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
      preHandler: fastify.auth([verifySession]),
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
        where: {
          isOfficial: true,
        },
        include: {
          icon: true,
        },
      });

      const foodsWithIcon: Food[] = foods.map((food) => {
        return {
          ...food,
          icon: !food.icon
            ? undefined
            : {
                id: food.icon.id,
                url: getFileUrl(food.icon.key),
              },
        };
      });

      return {
        foods: foodsWithIcon,
      };
    },
  );

  fastify.get(
    '/:foodId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Get a food',
        params: Type.Object({
          foodId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            food: foodSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { foodId } = request.params;

      const food = await prisma.food.findUniqueOrThrow({
        where: {
          id: foodId,
        },
        include: {
          icon: true,
        },
      });

      const foodDto: Food = {
        ...food,
        icon: !food.icon
          ? undefined
          : {
              id: food.icon.id,
              url: getFileUrl(food.icon.key),
            },
      };

      return {
        food: foodDto,
      };
    },
  );

  fastify.patch(
    '/:foodId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Update a food',
        params: Type.Object({
          foodId: Type.String({ format: 'uuid' }),
        }),
        body: updateFoodDtoSchema,
        response: {
          200: Type.Object({
            food: foodSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { foodId } = request.params;
      const { name, pluralName, iconId } = request.body;

      const oldFood = await prisma.food.findUniqueOrThrow({
        where: {
          id: foodId,
        },
        select: {
          isOfficial: true,
        },
      });

      if (oldFood.isOfficial && request.session?.accessRole !== 'admin') {
        throw new ApiError({
          name: 'AuthError',
          message: 'Forbidden',
          statusCode: 403,
        });
      }

      const food = await prisma.food.update({
        where: {
          id: foodId,
        },
        data: {
          name: name,
          pluralName: pluralName,
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

  fastify.delete(
    '/:foodId',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
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
