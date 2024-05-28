import { prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import {
  createRecipeDtoScema,
  recipeProjectedSchema,
  recipeSchema,
  updateRecipeDtoScema,
  type Recipe,
} from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { noContentSchema } from '../../types/noContent.js';

const routeTag = 'Recipes';

export async function recipeRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'Create a recipe',
        body: createRecipeDtoScema,
        response: {
          200: Type.Object({
            recipe: recipeSchema,
          }),
        },
      },
    },
    async (request) => {
      const {
        name,
        description,
        cookTime,
        prepTime,
        ingredients,
        instructions,
        usesRecipes,
      } = request.body;

      const recipe = await prisma.recipe.create({
        data: {
          name: name,
          description: description ?? null,
          prepTime: prepTime,
          cookTime: cookTime,
          ingredients: {
            create: ingredients.map((ingredient) => {
              const { food, ...rest } = ingredient;

              return {
                ...rest,
                unitId: rest.unitId ?? undefined,
                food:
                  'id' in food
                    ? { connect: { id: food.id } }
                    : { create: food },
              };
            }),
          },
          instructions: {
            createMany: {
              data: instructions.map((instruction, index) => ({
                step: index,
                text: instruction,
              })),
            },
          },
          usesRecipes: {
            connect: usesRecipes?.map((id) => ({
              id: id,
            })),
          },
        },
        include: {
          ingredients: {
            include: {
              food: true,
            },
          },
          instructions: true,
          usesRecipes: {
            select: {
              usesRecipeId: true,
            },
          },
          images: {
            include: {
              image: true,
            },
          },
        },
      });

      const recipeDto: Recipe = {
        ...recipe,
        usesRecipes: recipe.usesRecipes.map((r) => r.usesRecipeId),
        coverImage: recipe.images.at(0)?.image.url ?? null,
      };

      return {
        recipe: recipeDto,
      };
    },
  );

  fastify.get(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'List recipes',
        response: {
          200: Type.Object({
            recipes: Type.Array(recipeProjectedSchema),
          }),
        },
      },
    },
    async () => {
      const recipes = await prisma.recipe.findMany({
        include: {
          images: {
            include: {
              image: true,
            },
          },
        },
      });

      const recipeDtos = recipes.map((recipe) => ({
        ...recipe,
        coverImage: recipe.images.at(0)?.image.url ?? null,
      }));

      return {
        recipes: recipeDtos,
      };
    },
  );

  fastify.get(
    '/:recipeId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get a recipe',
        params: Type.Object({
          recipeId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            recipe: recipeSchema,
          }),
        },
      },
    },
    async (request) => {
      const { recipeId } = request.params;

      const recipe = await prisma.recipe.findUniqueOrThrow({
        where: {
          id: recipeId,
        },
        include: {
          ingredients: {
            include: {
              food: true,
            },
          },
          instructions: true,
          usesRecipes: {
            select: {
              usesRecipeId: true,
            },
          },
          images: {
            include: {
              image: true,
            },
          },
        },
      });

      const recipeDto: Recipe = {
        ...recipe,
        usesRecipes: recipe.usesRecipes.map((r) => r.usesRecipeId),
        coverImage: recipe.images.at(0)?.image.url ?? null,
      };

      return {
        recipe: recipeDto,
      };
    },
  );

  fastify.patch(
    '/:recipeId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Update a recipe',
        params: Type.Object({
          recipeId: Type.String({ format: 'uuid' }),
        }),
        body: updateRecipeDtoScema,
        response: {
          200: Type.Object({
            recipe: recipeSchema,
          }),
        },
      },
    },
    async (request) => {
      const {
        name,
        description,
        cookTime,
        prepTime,
        ingredients,
        instructions,
        usesRecipes,
      } = request.body;
      const { recipeId } = request.params;

      const recipe = await prisma.recipe.update({
        where: {
          id: recipeId,
        },
        data: {
          name: name,
          description: description ?? null,
          prepTime: prepTime,
          cookTime: cookTime,
          ingredients: {
            deleteMany: {},
            create: ingredients?.map((ingredient) => {
              const { food, ...rest } = ingredient;

              return {
                ...rest,
                unitId: rest.unitId ?? undefined,
                food:
                  'id' in food
                    ? { connect: { id: food.id } }
                    : { create: food },
              };
            }),
          },
          instructions: {
            deleteMany: {},
            createMany: {
              data:
                instructions?.map((instruction, index) => ({
                  step: index,
                  text: instruction,
                })) ?? [],
            },
          },
          usesRecipes: {
            connect: usesRecipes?.map((id) => ({
              id: id,
            })),
          },
        },
        include: {
          ingredients: {
            include: {
              food: true,
            },
          },
          instructions: true,
          usesRecipes: {
            select: {
              usesRecipeId: true,
            },
          },
          images: {
            include: {
              image: true,
            },
          },
        },
      });

      const recipeDto: Recipe = {
        ...recipe,
        usesRecipes: recipe.usesRecipes.map((r) => r.usesRecipeId),
        coverImage: recipe.images.at(0)?.image.url ?? null,
      };

      return {
        recipe: recipeDto,
      };
    },
  );

  fastify.delete(
    '/:recipeId',
    {
      schema: {
        tags: [routeTag],
        summary: 'Delete a recipe',
        params: Type.Object({
          recipeId: Type.String({ format: 'uuid' }),
        }),
        response: {
          204: noContentSchema,
        },
      },
    },
    async (request, reply) => {
      const { recipeId } = request.params;

      await prisma.recipe.delete({
        where: {
          id: recipeId,
        },
      });

      return reply.code(204).send();
    },
  );
}
