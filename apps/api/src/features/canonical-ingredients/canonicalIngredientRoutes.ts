import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import {
  canonicalIngredientSchemaRef,
  createCanonicalIngredientDtoScema,
  updateCanonicalIngredientDtoSchema,
  type CanonicalIngredient,
} from '@open-zero/features/canonical-ingredients';
import { Type } from '@sinclair/typebox';
import { getFileUrl } from '../../lib/s3.js';
import { noContentSchema } from '../../types/noContent.js';
import { verifyIsAdmin } from '../auth/verifyIsAdmin.js';
import { verifySession } from '../auth/verifySession.js';

const routeTag = 'Canonical ingredients';

// eslint-disable-next-line @typescript-eslint/require-await
export async function canonicalIngredientRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
      schema: {
        tags: [routeTag],
        summary: 'Create a canonical ingredient',
        body: createCanonicalIngredientDtoScema,
        response: {
          200: Type.Object({
            canonicalIngredient: canonicalIngredientSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name, iconId } = request.body;

      const food = await prisma.canonicalIngredient.create({
        data: {
          name: name,
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
        canonicalIngredient: food,
      };
    },
  );

  fastify.get(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'List canonical ingredients',
        response: {
          200: Type.Object({
            canonicalIngredients: Type.Array(canonicalIngredientSchemaRef),
          }),
        },
      },
    },
    async () => {
      const canonicalIngredients = await prisma.canonicalIngredient.findMany({
        where: {},
        include: {
          icon: true,
        },
      });

      const canonicalIngredientsWithIcon: CanonicalIngredient[] =
        await Promise.all(
          canonicalIngredients.map(async (canonicalIngredient) => {
            return {
              ...canonicalIngredient,
              icon: !canonicalIngredient.icon
                ? undefined
                : {
                    id: canonicalIngredient.icon.id,
                    url: await getFileUrl({
                      key: canonicalIngredient.icon.key,
                      public: true,
                    }),
                  },
            };
          }),
        );

      return {
        canonicalIngredients: canonicalIngredientsWithIcon,
      };
    },
  );

  fastify.get(
    '/:canonicalIngredientId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Get a canonical ingredient',
        params: Type.Object({
          canonicalIngredientId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            canonicalIngredient: canonicalIngredientSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { canonicalIngredientId } = request.params;

      const canonicalIngredient =
        await prisma.canonicalIngredient.findUniqueOrThrow({
          where: {
            id: canonicalIngredientId,
          },
          include: {
            icon: true,
          },
        });

      const canonicalIngredientDto: CanonicalIngredient = {
        ...canonicalIngredient,
        icon: !canonicalIngredient.icon
          ? undefined
          : {
              id: canonicalIngredient.icon.id,
              url: await getFileUrl({
                key: canonicalIngredient.icon.key,
                public: true,
              }),
            },
      };

      return {
        canonicalIngredient: canonicalIngredientDto,
      };
    },
  );

  fastify.patch(
    '/:canonicalIngredientId',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
      schema: {
        tags: [routeTag],
        summary: 'Update a canonical ingredient',
        params: Type.Object({
          canonicalIngredientId: Type.String({ format: 'uuid' }),
        }),
        body: updateCanonicalIngredientDtoSchema,
        response: {
          200: Type.Object({
            canonicalIngredient: canonicalIngredientSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { canonicalIngredientId } = request.params;
      const { name, iconId } = request.body;

      const canonicalIngredient = await prisma.canonicalIngredient.update({
        where: {
          id: canonicalIngredientId,
        },
        data: {
          name: name,
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
        canonicalIngredient: canonicalIngredient,
      };
    },
  );

  fastify.delete(
    '/:canonicalIngredientId',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
      schema: {
        tags: [routeTag],
        summary: 'Delete a canonical ingredient',
        params: Type.Object({
          canonicalIngredientId: Type.String(),
        }),
        response: {
          204: noContentSchema,
        },
      },
    },
    async (request, reply) => {
      const { canonicalIngredientId } = request.params;

      await prisma.canonicalIngredient.delete({
        where: {
          id: canonicalIngredientId,
        },
      });

      return reply.code(204).send();
    },
  );
}
