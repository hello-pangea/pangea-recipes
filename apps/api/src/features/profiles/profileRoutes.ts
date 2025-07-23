import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import { prisma } from '@open-zero/database';
import { publicProfileSchema } from '@open-zero/features/profiles';
import { Type } from '@sinclair/typebox';

const routeTag = 'Profiles';

// eslint-disable-next-line @typescript-eslint/require-await
export async function profileRoutes(fastify: FastifyTypebox) {
  fastify.get(
    '/:userId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get a public profile',
        security: [],
        params: Type.Object({
          userId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
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
}
