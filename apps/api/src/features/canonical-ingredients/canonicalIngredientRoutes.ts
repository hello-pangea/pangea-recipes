import { prisma } from '@open-zero/database';
import {
  canonicalIngredientSchema,
  createCanonicalIngredientContract,
  updateCanonicalIngredientContract,
  type CanonicalIngredient,
} from '@open-zero/features/canonical-ingredients';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { getFileUrl } from '../../lib/s3.ts';
import { noContentSchema } from '../../types/noContent.ts';
import { verifyIsAdmin } from '../auth/verifyIsAdmin.ts';
import { verifySession } from '../auth/verifySession.ts';

const routeTag = 'Canonical ingredients';

// eslint-disable-next-line @typescript-eslint/require-await
export const canonicalIngredientRoutes: FastifyPluginAsyncZod = async function (
  fastify,
) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
      schema: {
        tags: [routeTag],
        summary: 'Create a canonical ingredient',
        ...createCanonicalIngredientContract,
      },
    },
    async (request) => {
      const { name, iconId, aliases } = request.body;

      const canonicalIngredient = await prisma.canonicalIngredient.create({
        data: {
          name: name,
          icon: iconId
            ? {
                connect: {
                  id: iconId,
                },
              }
            : undefined,
          aliases:
            aliases && aliases.length > 0
              ? {
                  createMany: {
                    data: aliases.map((alias) => ({
                      name: alias,
                    })),
                  },
                }
              : undefined,
        },
        include: {
          aliases: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        canonicalIngredient: {
          ...canonicalIngredient,
          aliases: canonicalIngredient.aliases.map((alias) => alias.name),
        },
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
          200: z.object({
            canonicalIngredients: z.array(canonicalIngredientSchema),
          }),
        },
      },
    },
    async () => {
      const canonicalIngredients = await prisma.canonicalIngredient.findMany({
        where: {},
        include: {
          icon: true,
          aliases: {
            select: {
              name: true,
            },
          },
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
              aliases: canonicalIngredient.aliases.map((alias) => alias.name),
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
        params: z.object({
          canonicalIngredientId: z.uuidv4(),
        }),
        response: {
          200: z.object({
            canonicalIngredient: canonicalIngredientSchema,
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
            aliases: {
              select: {
                name: true,
              },
            },
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
        aliases: canonicalIngredient.aliases.map((alias) => alias.name),
      };

      return {
        canonicalIngredient: canonicalIngredientDto,
      };
    },
  );

  fastify.patch(
    '/:id',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
      schema: {
        tags: [routeTag],
        summary: 'Update a canonical ingredient',
        ...updateCanonicalIngredientContract,
      },
    },
    async (request) => {
      const { id } = request.params;
      const { name, iconId, aliases } = request.body;

      const canonicalIngredient = await prisma.canonicalIngredient.update({
        where: {
          id: id,
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
          aliases: aliases
            ? {
                deleteMany: {},
                createMany: {
                  data: aliases.map((alias) => ({
                    name: alias,
                  })),
                },
              }
            : undefined,
        },
        include: {
          aliases: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        canonicalIngredient: {
          ...canonicalIngredient,
          aliases: canonicalIngredient.aliases.map((alias) => alias.name),
        },
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
        params: z.object({
          canonicalIngredientId: z.uuidv4(),
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
};
