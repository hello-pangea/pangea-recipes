import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { unitSchemaRef } from '@open-zero/features';
import { Type } from '@sinclair/typebox';

const routeTag = 'Units';

export async function unitRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'Create a unit',
        body: Type.Object({
          name: Type.String(),
          pluralName: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            unit: unitSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { name, pluralName } = request.body;

      const unit = await prisma.unit.create({
        data: {
          name: name,
          pluralName: pluralName ?? null,
        },
      });

      return {
        unit: unit,
      };
    },
  );

  fastify.get(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'List units',
        response: {
          200: Type.Object({
            units: Type.Array(unitSchemaRef),
          }),
        },
      },
    },
    async () => {
      const units = await prisma.unit.findMany({});

      return {
        units: units,
      };
    },
  );
}
