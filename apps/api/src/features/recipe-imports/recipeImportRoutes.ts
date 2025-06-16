import { ApiError } from '#src/lib/ApiError.ts';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import { prisma } from '@open-zero/database';
import {
  importedRecipeSchema,
  recipeImportSchema,
} from '@open-zero/features/recipe-imports';
import { Type } from '@sinclair/typebox';
import { verifySession } from '../auth/verifySession.ts';
import { createRecipe } from '../recipes/recipeRepo.ts';
import { getLlmImportRecipe } from './getLlmImportRecipe.ts';
import { isValidHttpUrl } from './isValidHttpUrl.ts';

const routeTag = 'Recipe imports';

// eslint-disable-next-line @typescript-eslint/require-await
export async function recipeImportRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Import a recipe from a url',
        body: Type.Object({
          url: Type.String({
            format: 'uri',
          }),
        }),
        response: {
          200: Type.Object({
            recipe: importedRecipeSchema,
            websitePageId: Type.String(),
          }),
        },
      },
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (request) => {
      const { url: urlString } = request.body;

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
        recipe: recipe,
      };
    },
  );

  fastify.post(
    '/quick',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: "Import a recipe from a url (don't await parsing)",
        body: Type.Object({
          url: Type.String({ format: 'uri' }),
        }),
        response: {
          202: Type.Null({ description: 'No content' }),
        },
      },
    },
    async (request, reply) => {
      const { url } = request.body;

      const userId = request.session?.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      if (!isValidHttpUrl(url)) {
        throw new ApiError({
          statusCode: 400,
          message: 'Invalid URL',
          name: 'InvalidUrl',
        });
      }

      const recipeImport = await prisma.recipeImport.create({
        data: {
          url: url,
          userId: userId,
          status: 'parsing',
        },
      });

      reply.code(202).send(null);

      const { parsedRecipe, websitePage } = await getLlmImportRecipe(url);

      await createRecipe({
        userId,
        name: parsedRecipe.name,
        description: parsedRecipe.description,
        cookTime: parsedRecipe.cookTime,
        prepTime: parsedRecipe.prepTime,
        servings: parsedRecipe.servings,
        ingredientGroups: parsedRecipe.ingredientGroups,
        instructionGroups: parsedRecipe.instructionGroups.map((group) => ({
          name: group.name,
          instructions: group.instructions.map((instruction) => ({
            text: instruction,
          })),
        })),
        nutrition: parsedRecipe.nutrition ?? undefined,
        websitePageId: websitePage.id,
      });

      await prisma.recipeImport.update({
        where: {
          id: recipeImport.id,
        },
        data: {
          status: 'complete',
        },
      });
    },
  );

  fastify.get(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'List recipe imports',
        querystring: Type.Object({
          userId: Type.String({
            format: 'uuid',
          }),
          status: Type.Optional(
            Type.Union([
              Type.Literal('parsing'),
              Type.Literal('complete'),
              Type.Literal('failed'),
            ]),
          ),
        }),
        response: {
          200: Type.Object({
            recipeImports: Type.Array(recipeImportSchema),
          }),
        },
      },
    },
    async (request) => {
      const { userId, status } = request.query;

      if (userId !== request.session?.userId) {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

      const recipeImports = await prisma.recipeImport.findMany({
        where: {
          status: status ?? undefined,
        },
      });

      return {
        recipeImports: recipeImports,
      };
    },
  );
}
