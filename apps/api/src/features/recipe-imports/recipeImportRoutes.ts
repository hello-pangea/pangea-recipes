import { ApiError } from '#src/lib/ApiError.ts';
import { noContentSchema } from '#src/types/noContent.ts';
import { prisma } from '@open-zero/database';
import {
  importedRecipeSchema,
  recipeImportSchema,
} from '@open-zero/features/recipe-imports';
import * as Sentry from '@sentry/node';
import { type FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { verifySession } from '../auth/verifySession.ts';
import { createRecipe } from '../recipes/recipeRepo.ts';
import { getLlmImportRecipe } from './getLlmImportRecipe.ts';
import { isValidHttpUrl } from './isValidHttpUrl.ts';

const routeTag = 'Recipe imports';

// eslint-disable-next-line @typescript-eslint/require-await
export const recipeImportRoutes: FastifyPluginAsyncZod = async function (
  fastify,
) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Import a recipe from a url',
        body: z.object({
          url: z.url(),
        }),
        response: {
          200: z.object({
            recipe: importedRecipeSchema,
            websitePageId: z.uuidv4(),
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
        body: z.object({
          url: z.url(),
        }),
        response: {
          202: noContentSchema,
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

      try {
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
      } catch (error: unknown) {
        Sentry.captureException(error);

        await prisma.recipeImport.update({
          where: {
            id: recipeImport.id,
          },
          data: {
            status: 'failed',
            error: (error as Error).message,
          },
        });
      }
    },
  );

  fastify.get(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'List recipe imports',
        querystring: z.object({
          userId: z.uuidv4(),
          status: z.enum(['parsing', 'complete', 'failed']).optional(),
        }),
        response: {
          200: z.object({
            recipeImports: z.array(recipeImportSchema),
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
};
