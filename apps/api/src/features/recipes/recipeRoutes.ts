import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import { prisma, type Prisma } from '@open-zero/database';
import { tagSchema, type CreateTagDto } from '@open-zero/features';
import {
  createRecipeDtoScema,
  recipeProjectedSchema,
  recipeSchema,
  updateRecipeDtoScema,
} from '@open-zero/features/recipes';
import { Type } from '@sinclair/typebox';
import { ApiError } from '../../lib/ApiError.ts';
import { getFileUrl } from '../../lib/s3.ts';
import { noContentSchema } from '../../types/noContent.ts';
import { verifySession } from '../auth/verifySession.ts';
import { mapToRecipeDto, recipeInclude } from './recipeDtoUtils.ts';
import { updateIngredientGroups } from './updateIngredientGroups.ts';
import { updateInstructionGroups } from './updateInstructionGroups.ts';

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
        servings,
        imageIds,
        ingredientGroups,
        instructionGroups,
        usesRecipes,
        tags,
        websitePageId,
        nutrition,
      } = request.body;

      const userId = request.session?.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      let ingredientTerms = ingredientGroups.flatMap((group) =>
        group.ingredients.map((ingredient) =>
          ingredient.name.toLocaleLowerCase(),
        ),
      );

      ingredientTerms.push(
        ...ingredientTerms.map((term) => term.split(' ')).flat(),
      );

      ingredientTerms = [...new Set(ingredientTerms.filter(Boolean))];

      const conditions: Prisma.CanonicalIngredientWhereInput[] =
        ingredientTerms.flatMap((term) => [
          { name: { contains: term, mode: 'insensitive' } },
          {
            aliases: {
              some: { name: { contains: term, mode: 'insensitive' } },
            },
          },
        ]);

      const canonicalIngredients = await prisma.canonicalIngredient.findMany({
        where: {
          OR: conditions,
        },
        include: {
          aliases: {
            select: {
              name: true,
            },
          },
        },
      });

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
          servings: servings,
          images: imageIds
            ? {
                create: imageIds.map((id) => ({
                  imageId: id,
                })),
              }
            : undefined,
          ingredientGroups: {
            create: ingredientGroups.map((ingredientGroup, index) => ({
              name: ingredientGroup.name ?? null,
              order: index,
              ingredients: {
                create: ingredientGroup.ingredients.map((ingredient, index) => {
                  const terms = ingredient.name
                    .toLocaleLowerCase()
                    .split(' ')
                    .filter(Boolean);
                  const matchingCanonicalIngredient =
                    canonicalIngredients.find((canonicalIngredient) =>
                      ingredient.name
                        .toLocaleLowerCase()
                        .includes(canonicalIngredient.name),
                    ) ??
                    canonicalIngredients.find(
                      (canonicalIngredient) =>
                        terms.includes(canonicalIngredient.name) ||
                        canonicalIngredient.aliases.some((alias) =>
                          terms.includes(alias.name),
                        ),
                    );

                  return {
                    ...ingredient,
                    order: index,
                    canonicalIngredientId:
                      canonicalIngredients.find(
                        (canonicalIngredient) =>
                          canonicalIngredient.name ===
                          ingredient.name.toLocaleLowerCase(),
                      )?.id ??
                      matchingCanonicalIngredient?.id ??
                      null,
                  };
                }),
              },
            })),
          },
          instructionGroups: {
            create: instructionGroups.map((instructionGroup, index) => ({
              name: instructionGroup.name ?? null,
              order: index,
              instructions: {
                create: instructionGroup.instructions.map(
                  (instruction, index) => ({
                    order: index,
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
          sourceWebsitePage: websitePageId
            ? {
                connect: {
                  id: websitePageId,
                },
              }
            : undefined,
          nutrition: nutrition
            ? {
                create: nutrition,
              }
            : undefined,
        },
        include: recipeInclude,
      });

      const recipeDto = await mapToRecipeDto(recipe);

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
          userId: Type.Optional(Type.String({ format: 'uuid' })),
          recipeBookId: Type.Optional(Type.String({ format: 'uuid' })),
        }),
        response: {
          200: Type.Object({
            recipes: Type.Array(recipeProjectedSchema),
          }),
        },
      },
    },
    async (request) => {
      const { userId, recipeBookId } = request.query;

      if (userId && userId !== request.session?.userId) {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

      const recipes = await prisma.recipe.findMany({
        where: {
          userId: userId,
          recipeBooks: recipeBookId
            ? { some: { recipeBookId: recipeBookId } }
            : undefined,
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
          sourceWebsitePage: {
            include: {
              website: true,
            },
          },
        },
      });

      const recipeDtos = await Promise.all(
        recipes.map(async (recipe) => ({
          ...recipe,
          images: await Promise.all(
            recipe.images.map(async (image) => ({
              id: image.image.id,
              url: await getFileUrl({ key: image.image.key, public: false }),
              favorite: image.favorite ?? false,
            })),
          ),
          tags: recipe.tags.map((tag) => ({
            id: tag.tag.id,
            name: tag.tag.name,
          })),
          websiteSource: recipe.sourceWebsitePage
            ? {
                title: recipe.sourceWebsitePage.website.title,
                url: `https://${recipe.sourceWebsitePage.website.host}${recipe.sourceWebsitePage.path}`,
              }
            : null,
        })),
      );

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
        include: recipeInclude,
      });

      const recipeDto = await mapToRecipeDto(recipe);

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
        servings,
        ingredientGroups,
        instructionGroups,
        usesRecipes,
        tags,
        imageIds,
        nutrition,
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
            instructionGroups: true,
            ingredientGroups: true,
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
          | undefined =
          tags !== undefined
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

        await updateInstructionGroups({
          tx: prisma,
          newInstructionGroups: instructionGroups,
          oldInstructionGroups: oldRecipe.instructionGroups,
          recipeId: recipeId,
        });

        await updateIngredientGroups({
          tx: prisma,
          newIngredientGroups: ingredientGroups,
          oldIngredientGroups: oldRecipe.ingredientGroups,
          recipeId: recipeId,
        });

        // -
        // Update
        // -

        const recipeUpdate: Prisma.RecipeUpdateInput = {
          name: name,
          description: description,
          prepTime: prepTime,
          cookTime: cookTime,
          servings: servings,
          usesRecipes: !usesRecipes
            ? undefined
            : {
                connect: usesRecipes.map((id) => ({
                  id: id,
                })),
              },
          tags: tagsUpdate,
          images:
            imageIds === undefined
              ? undefined
              : imageIds === null
                ? {
                    deleteMany: {},
                  }
                : {
                    deleteMany: {
                      imageId: {
                        notIn: imageIds,
                      },
                    },
                    connectOrCreate: imageIds.map((id) => ({
                      where: {
                        recipeId_imageId: {
                          recipeId: recipeId,
                          imageId: id,
                        },
                      },
                      create: {
                        imageId: id,
                      },
                    })),
                  },
          nutrition: nutrition
            ? {
                upsert: {
                  create: nutrition,
                  update: nutrition,
                },
              }
            : undefined,
        };

        const recipe = await prisma.recipe.update({
          where: {
            id: recipeId,
          },
          data: recipeUpdate,
          include: recipeInclude,
        });

        const recipeDto = await mapToRecipeDto(recipe);

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

  fastify.get(
    '/used-tags',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'List used recipe tags',
        querystring: Type.Object({
          userId: Type.Optional(Type.String({ format: 'uuid' })),
        }),
        response: {
          200: Type.Object({
            tags: Type.Array(tagSchema),
          }),
        },
      },
    },
    async (request) => {
      const { userId } = request.query;

      if (userId && userId !== request.session?.userId) {
        throw new ApiError({
          statusCode: 403,
          message: 'Forbidden',
          name: 'AuthError',
        });
      }

      const tags = await prisma.recipeTag.findMany({
        where: {
          recipe: {
            userId: userId,
          },
        },
        select: {
          tag: true,
        },
      });

      const tagsDto = tags.map((tag) => tag.tag);

      return {
        tags: tagsDto,
      };
    },
  );
}
