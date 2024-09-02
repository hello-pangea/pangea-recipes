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
import { ApiError } from '../../lib/ApiError.js';
import { getFileUrl } from '../../lib/s3.js';
import { noContentSchema } from '../../types/noContent.js';
import { verifySession } from '../auth/verifySession.js';

const routeTag = 'Recipes';

// eslint-disable-next-line @typescript-eslint/require-await
export async function recipeRoutes(fastify: FastifyTypebox) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
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
      preHandler: fastify.auth([verifySession]),
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

      if (userId !== request.session?.userId) {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

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

      const recipeDto = await prisma.$transaction(async (prisma) => {
        const oldRecipe = await prisma.recipe.findUniqueOrThrow({
          where: {
            id: recipeId,
          },
          select: {
            userId: true,
            tags: {
              select: {
                tagId: true,
              },
            },
          },
        });

        if (oldRecipe.userId !== request.session?.userId) {
          throw new ApiError({
            statusCode: 403,
            message: 'Forbidden',
            name: 'AuthError',
          });
        }

        // -
        // Tags
        // -

        const existingTagIds = oldRecipe.tags.map((tag) => tag.tagId);

        const tagsToCreate =
          tags?.filter((tag) => 'name' in tag && !('id' in tag)) ??
          ([] as CreateTagDto[]);

        const tagsWithIds = tags?.filter((tag) => 'id' in tag) ?? [];

        const tagsToAdd = tagsWithIds.filter(
          (tag) => !existingTagIds.includes(tag.id),
        );

        const tagIdsToRemove = existingTagIds.filter(
          (id) => !tagsWithIds.some((tag) => tag.id === id),
        );

        const tagsToCreateOrAdd = [...tagsToCreate, ...tagsToAdd];

        const tagsUpdate:
          | Prisma.RecipeTagUpdateManyWithoutRecipeNestedInput
          | undefined = tags?.length
          ? {
              create: !tagsToCreateOrAdd.length
                ? undefined
                : tagsToCreateOrAdd.map((tag) => {
                    if ('id' in tag) {
                      return {
                        tag: {
                          connect: tag,
                        },
                      };
                    } else {
                      return {
                        tag: {
                          create: tag,
                        },
                      };
                    }
                  }),
              deleteMany: tagIdsToRemove.length
                ? {
                    tagId: {
                      in: tagIdsToRemove,
                    },
                  }
                : undefined,
            }
          : undefined;

        // -
        // Update
        // -

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
          tags: tagsUpdate,
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

        return recipeDto;
      });

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

      const recipe = await prisma.recipe.findUniqueOrThrow({
        where: {
          id: recipeId,
        },
        select: {
          userId: true,
        },
      });

      if (recipe.userId !== request.session?.userId) {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

      await prisma.recipe.delete({
        where: {
          id: recipeId,
        },
      });

      return reply.code(204).send();
    },
  );
}
