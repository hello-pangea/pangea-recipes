import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { importedRecipeSchema } from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { verifySession } from '../auth/verifySession.js';
import { getLlmImportRecipe } from './getLlmImportRecipe.js';

const routeTag = 'Imported recipes';

// eslint-disable-next-line @typescript-eslint/require-await
export async function importedRecipeRoutes(fastify: FastifyTypebox) {
  fastify.get(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Import a recipe from a url',
        querystring: Type.Object({
          url: Type.String(),
        }),
        response: {
          200: Type.Object({
            importedRecipe: importedRecipeSchema,
          }),
        },
      },
    },
    async (request) => {
      const { url } = request.query;

      const recipe = await getLlmImportRecipe(url);

      return {
        importedRecipe: recipe,
      };
    },
  );
}
