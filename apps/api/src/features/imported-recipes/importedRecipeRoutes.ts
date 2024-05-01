import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import { importedRecipeSchema } from '@open-zero/features';
import { getImportedRecipeFromUrl } from '@open-zero/recipe-importer';
import { Type } from '@sinclair/typebox';

const routeTag = 'Imported recipes';

export async function importedRecipeRoutes(fastify: FastifyTypebox) {
  fastify.get(
    '',
    {
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

      const importedRecipe = await getImportedRecipeFromUrl(url);

      return {
        importedRecipe: importedRecipe,
      };
    },
  );
}
