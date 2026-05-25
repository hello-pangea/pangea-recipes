import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { prisma } from '@repo/database';
import { getPublicProfileContract } from '@repo/features/profiles';

const routeTag = 'Profiles';

// oxlint-disable-next-line typescript/require-await
export const profileRoutes: FastifyPluginAsyncZod = async function (fastify) {
  fastify.get(
    '/:id',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get a public profile',
        security: [],
        ...getPublicProfileContract,
      },
    },
    async (request) => {
      const { id } = request.params;

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });

      return {
        profile: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      };
    },
  );
};
