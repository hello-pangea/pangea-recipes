import { prisma, type Prisma } from '#src/lib/prisma.js';
import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import {
  createRecipeDtoScema,
  recipeProjectedSchema,
  recipeSchema,
  updateRecipeDtoScema,
  type CreateTagDto,
  type Recipe,
} from '@open-zero/features';
import { Type } from '@sinclair/typebox';
import { getFileUrl } from '../../lib/s3.js';
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
        imageIds,
        ingredients,
        instructionGroups,
        usesRecipes,
        tags,
      } = request.body;

      const userId = request.session?.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const recipe = await prisma.recipe.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          name: name,
          description: description ?? null,
          prepTime: prepTime,
          cookTime: cookTime,
          images: imageIds
            ? {
                create: imageIds.map((id) => ({
                  imageId: id,
                })),
              }
            : undefined,
          ingredients: {
            create: ingredients.map((ingredient) => {
              const { food, ...rest } = ingredient;

              return {
                ...rest,
                unit: rest.unit ?? undefined,
                food:
                  'id' in food
                    ? { connect: { id: food.id } }
                    : { create: food },
              };
            }),
          },
          instructionGroups: {
            create: instructionGroups.map((instructionGroup, index) => ({
              title: instructionGroup.title ?? null,
              sort: index.toString(),
              instructions: {
                create: instructionGroup.instructions.map(
                  (instruction, index) => ({
                    step: index,
                    text: instruction.text,
                  }),
                ),
              },
            })),
          },
          usesRecipes: {
            connect: usesRecipes?.map((id) => ({
              id: id,
            })),
          },
          tags: {
            create: tags?.map((tag) => {
              if ('id' in tag) {
                return {
                  tag: {
                    connect: {
                      id: tag.id,
                    },
                  },
                };
              } else {
                return {
                  tag: {
                    create: {
                      name: tag.name,
                    },
                  },
                };
              }
            }),
          },
        },
        include: {
          ingredients: {
            include: {
              food: true,
            },
          },
          instructionGroups: {
            include: {
              instructions: true,
            },
          },
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
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const recipeDto: Recipe = {
        ...recipe,
        usesRecipes: recipe.usesRecipes.map((r) => r.usesRecipeId),
        images: recipe.images.map((image) => ({
          id: image.image.id,
          url: getFileUrl(image.image.key),
          favorite: image.favorite ?? false,
        })),
        tags: recipe.tags.map((tag) => ({
          id: tag.tag.id,
          name: tag.tag.name,
        })),
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
        querystring: Type.Object({
          userId: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: Type.Object({
            recipes: Type.Array(recipeProjectedSchema),
          }),
        },
      },
    },
    async (request) => {
      const { userId } = request.query;

      const recipes = await prisma.recipe.findMany({
        where: {
          userId: userId,
        },
        include: {
          images: {
            include: {
              image: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const recipeDtos = recipes.map((recipe) => ({
        ...recipe,
        images: recipe.images.map((image) => ({
          id: image.image.id,
          url: getFileUrl(image.image.key),
          favorite: image.favorite ?? false,
        })),
        tags: recipe.tags.map((tag) => ({
          id: tag.tag.id,
          name: tag.tag.name,
        })),
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
              food: {
                include: {
                  icon: true,
                },
              },
            },
          },
          instructionGroups: {
            include: {
              instructions: true,
            },
          },
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
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const recipeDto: Recipe = {
        ...recipe,
        usesRecipes: recipe.usesRecipes.map((r) => r.usesRecipeId),
        images: recipe.images.map((image) => ({
          id: image.image.id,
          url: getFileUrl(image.image.key),
          favorite: image.favorite ?? false,
        })),
        ingredients: recipe.ingredients.map((ingredient) => ({
          ...ingredient,
          food: {
            ...ingredient.food,
            icon: ingredient.food.icon
              ? {
                  id: ingredient.food.icon.id,
                  url: getFileUrl(ingredient.food.icon.key),
                }
              : undefined,
          },
        })),
        tags: recipe.tags.map((tag) => ({
          id: tag.tag.id,
          name: tag.tag.name,
        })),
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
        instructionGroups,
        usesRecipes,
        tags,
      } = request.body;
      const { recipeId } = request.params;

      const oldRecipe = await prisma.recipe.findUniqueOrThrow({
        where: {
          id: recipeId,
        },
        select: {
          tags: {
            select: {
              tagId: true,
            },
          },
        },
      });

      const newTagIds = tags?.map((tag) => ('id' in tag ? tag.id : null));

      const oldTagIds = oldRecipe.tags.map((tag) => tag.tagId);

      const tagsToDelete = oldTagIds.filter((id) => !newTagIds?.includes(id));

      const tagsToCreate = tags?.filter(
        (tag) => !('id' in tag),
      ) as CreateTagDto[];
      const tagsToConnect =
        tags?.filter((tag) => 'id' in tag && !oldTagIds.includes(tag.id)) ?? [];

      const tagsToCreateOrConnect = [...tagsToConnect, ...tagsToCreate];

      const recipeUpdate: Prisma.RecipeUpdateInput = {
        name: name,
        description: description,
        prepTime: prepTime,
        cookTime: cookTime,
        ingredients: !ingredients
          ? undefined
          : {
              deleteMany: {},
              create: ingredients.map((ingredient) => {
                const { food, ...rest } = ingredient;

                return {
                  ...rest,
                  unit: rest.unit ?? undefined,
                  food:
                    'id' in food
                      ? { connect: { id: food.id } }
                      : { create: food },
                };
              }),
            },
        instructionGroups: !instructionGroups
          ? undefined
          : {
              deleteMany: {},
              createMany: {
                data: instructionGroups.map((instructionGroup, index) => ({
                  title: instructionGroup.title,
                  sort: index.toString(),
                  instructions: {
                    createMany: {
                      data: instructionGroup.instructions.map(
                        (instruction, index) => ({
                          step: index,
                          text: instruction,
                        }),
                      ),
                    },
                  },
                })),
              },
            },
        usesRecipes: !usesRecipes
          ? undefined
          : {
              connect: usesRecipes.map((id) => ({
                id: id,
              })),
            },
        // Connect existing tags if id exists, or create and connect new tags if id does not exist
        tags: !tags
          ? undefined
          : {
              deleteMany: !tagsToDelete.length
                ? undefined
                : {
                    tagId: {
                      in: tagsToDelete,
                    },
                  },
              create: !tagsToCreateOrConnect.length
                ? undefined
                : tagsToCreateOrConnect.map((tag) => {
                    if ('id' in tag) {
                      return {
                        tag: {
                          connect: {
                            id: tag.id,
                          },
                        },
                      };
                    } else {
                      return {
                        tag: {
                          create: {
                            name: tag.name,
                          },
                        },
                      };
                    }
                  }),
            },
      };

      const recipe = await prisma.recipe.update({
        where: {
          id: recipeId,
        },
        data: recipeUpdate,
        include: {
          ingredients: {
            include: {
              food: true,
            },
          },
          instructionGroups: {
            include: {
              instructions: true,
            },
          },
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
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const recipeDto: Recipe = {
        ...recipe,
        usesRecipes: recipe.usesRecipes.map((r) => r.usesRecipeId),
        images: recipe.images.map((image) => ({
          id: image.image.id,
          url: getFileUrl(image.image.key),
          favorite: image.favorite ?? false,
        })),
        tags: recipe.tags.map((tag) => ({
          id: tag.tag.id,
          name: tag.tag.name,
        })),
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
