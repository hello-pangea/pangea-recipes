import { prisma } from '@open-zero/database';
import {
  addRecipeToRecipeBookContract,
  removeRecipeFromRecipeBookContract,
} from '@open-zero/features/recipe-books';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { verifySession } from '../auth/verifySession.ts';
import { mapToRecipeBookDto, recipeBookInclude } from './recipeBookDtoUtils.ts';

const routeTag = 'Recipe books';

// eslint-disable-next-line @typescript-eslint/require-await
export const recipeBookRecipeRoutes: FastifyPluginAsyncZod = async function (
  fastify,
) {
  fastify.post(
    '/:id/recipes',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Add a recipe to a recipe book',
        ...addRecipeToRecipeBookContract,
      },
    },
    async (request) => {
      const { id } = request.params;
      const { recipeId } = request.body;

      // Check if the recipe is already in the recipe book
      const recipeBookWithRecipe = await prisma.recipeBook.findUnique({
        where: {
          id: id,
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
          id: id,
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
    '/:id/recipes/:recipeId',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Remove a recipe from a recipe book',
        ...removeRecipeFromRecipeBookContract,
      },
    },
    async (request) => {
      const { id, recipeId } = request.params;

      const recipeBook = await prisma.recipeBook.update({
        where: {
          id: id,
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
};
