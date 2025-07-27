import { prisma } from '@open-zero/database';
import { publicProfileSchema } from '@open-zero/features/profiles';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

const routeTag = 'Profiles';

// eslint-disable-next-line @typescript-eslint/require-await
export const profileRoutes: FastifyPluginAsyncZod = async function (fastify) {
  fastify.get(
    '/:userId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get a public profile',
        security: [],
        params: z.object({
          userId: z.uuidv4(),
        }),
        response: {
          200: z.object({
            profile: publicProfileSchema,
          }),
        },
      },
    },
    async (request) => {
      const { userId } = request.params;

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
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
