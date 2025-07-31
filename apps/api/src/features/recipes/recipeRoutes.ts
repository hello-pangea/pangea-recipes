import { prisma, type Prisma } from '@open-zero/database';
import { type CreateTagDto } from '@open-zero/features';
import {
  createRecipeContract,
  deleteRecipeContract,
  getRecipeContract,
  getUsedRecipeTagsContract,
  listRecipesContract,
  updateRecipeContract,
} from '@open-zero/features/recipes';
import { type FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { ApiError } from '../../lib/ApiError.ts';
import { getFileUrl } from '../../lib/s3.ts';
import { verifySession } from '../auth/verifySession.ts';
import { mapToRecipeDto, recipeInclude } from './recipeDtoUtils.ts';
import { createRecipe } from './recipeRepo.ts';
import { updateIngredientGroups } from './updateIngredientGroups.ts';
import { updateInstructionGroups } from './updateInstructionGroups.ts';

const routeTag = 'Recipes';

// eslint-disable-next-line @typescript-eslint/require-await
export const recipeRoutes: FastifyPluginAsyncZod = async function (fastify) {
  fastify.post(
    '',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'Create a recipe',
        ...createRecipeContract,
      },
    },
    async (request) => {
      const userId = request.session?.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const recipe = await createRecipe({
        ...request.body,
        userId,
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
        ...listRecipesContract,
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
              url: await getFileUrl({
                key: image.image.key,
                public: image.image.public,
              }),
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
    '/:id',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get a recipe',
        ...getRecipeContract,
      },
    },
    async (request) => {
      const { id } = request.params;

      const recipe = await prisma.recipe.findUniqueOrThrow({
        where: {
          id: id,
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
    '/:id',
    {
      schema: {
        tags: [routeTag],
        summary: 'Update a recipe',
        ...updateRecipeContract,
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
        tryLater,
        favorite,
      } = request.body;
      const { id } = request.params;

      const recipeDto = await prisma.$transaction(async (prisma) => {
        const oldRecipe = await prisma.recipe.findUniqueOrThrow({
          where: {
            id: id,
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
          recipeId: id,
        });

        await updateIngredientGroups({
          tx: prisma,
          newIngredientGroups: ingredientGroups,
          oldIngredientGroups: oldRecipe.ingredientGroups,
          recipeId: id,
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
          tryLater: tryLater,
          favorite: favorite,
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
                          recipeId: id,
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
            id: id,
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
    '/:id',
    {
      schema: {
        tags: [routeTag],
        summary: 'Delete a recipe',
        ...deleteRecipeContract,
      },
    },
    async (request) => {
      const { id } = request.params;

      const recipe = await prisma.recipe.findUniqueOrThrow({
        where: {
          id: id,
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
          id: id,
        },
      });

      return null;
    },
  );

  fastify.get(
    '/used-tags',
    {
      preHandler: fastify.auth([verifySession]),
      schema: {
        tags: [routeTag],
        summary: 'List used recipe tags',
        ...getUsedRecipeTagsContract,
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
};
