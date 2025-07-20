import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import { prisma } from '@open-zero/database';
import { recipeBookSchemaRef } from '@open-zero/features/recipe-books';
import { Type } from '@sinclair/typebox';
import { verifySession } from '../auth/verifySession.ts';
import { mapToRecipeBookDto, recipeBookInclude } from './recipeBookDtoUtils.ts';

const routeTag = 'Recipe books';

// eslint-disable-next-line @typescript-eslint/require-await
export async function recipeBookRecipeRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '/:recipeBookId/recipes',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Add a recipe to a recipe book',
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
        }),
        body: Type.Object({
          recipeId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            recipeBook: recipeBookSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { recipeBookId } = request.params;
      const { recipeId } = request.body;

      // Check if the recipe is already in the recipe book
      const recipeBookWithRecipe = await prisma.recipeBook.findUnique({
        where: {
          id: recipeBookId,
        },
        select: {
          recipes: {
            where: {
              recipeId: recipeId,
            },
          },
        },
      });

      if (recipeBookWithRecipe?.recipes.length) {
        throw fastify.httpErrors.conflict({
          message: 'Recipe already exists in this recipe book',
        });
      }

      const recipeBook = await prisma.recipeBook.update({
        where: {
          id: recipeBookId,
        },
        data: {
          recipes: {
            create: {
              recipe: {
                connect: {
                  id: recipeId,
                },
              },
            },
          },
        },
        include: recipeBookInclude,
      });

      return {
        recipeBook: mapToRecipeBookDto(recipeBook),
      };
    },
  );

  fastify.delete(
    '/:recipeBookId/recipes/:recipeId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Remove a recipe from a recipe book',
        params: Type.Object({
          recipeBookId: Type.String({ format: 'uuid' }),
          recipeId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            recipeBook: recipeBookSchemaRef,
          }),
        },
      },
    },
    async (request) => {
      const { recipeBookId, recipeId } = request.params;

      const recipeBook = await prisma.recipeBook.update({
        where: {
          id: recipeBookId,
        },
        data: {
          recipes: {
            deleteMany: {
              recipeId: recipeId,
            },
          },
        },
        include: recipeBookInclude,
      });

      return {
        recipeBook: mapToRecipeBookDto(recipeBook),
      };
    },
  );
}
