import { ApiError } from '#src/lib/ApiError.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { importedRecipeSchema } from '@open-zero/features/imported-recipes';
import { Type } from '@sinclair/typebox';
import { verifySession } from '../auth/verifySession.js';
import { getLlmImportRecipe } from './getLlmImportRecipe.js';
import { isValidHttpUrl } from './isValidHttpUrl.js';

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
          url: Type.String({
            format: 'uri',
          }),
        }),
        response: {
          200: Type.Object({
            importedRecipe: importedRecipeSchema,
            websitePageId: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const { url: urlString } = request.query;

      if (!isValidHttpUrl(urlString)) {
        throw new ApiError({
          statusCode: 400,
          message: 'Invalid URL',
          name: 'InvalidUrl',
        });
      }

      const { parsedRecipe: recipe, websitePage } =
        await getLlmImportRecipe(urlString);

      return {
        websitePageId: websitePage.id,
        importedRecipe: recipe,
      };
    },
  );
}
