import { Prisma, prisma } from '@repo/database';
import type { createRecipeContract } from '@repo/features/recipes';
import type z from 'zod';
import { omitUndefined } from '../../lib/omitUndefined.ts';
import { recipeInclude } from './recipeDtoUtils.ts';

export async function createRecipe(
  data: z.infer<typeof createRecipeContract.body> & { userId: string },
) {
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
    tryLater,
    favorite,
    userId,
  } = data;

  let ingredientTerms = ingredientGroups.flatMap((group) =>
    group.ingredients.map((ingredient) => ingredient.name.toLocaleLowerCase()),
  );

  ingredientTerms.push(...ingredientTerms.flatMap((term) => term.split(' ')));

  ingredientTerms = [...new Set(ingredientTerms.filter(Boolean))];

  const conditions: Prisma.CanonicalIngredientWhereInput[] = ingredientTerms.flatMap((term) => [
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
      ...(prepTime !== undefined && { prepTime: prepTime }),
      ...(cookTime !== undefined && { cookTime: cookTime }),
      ...(servings !== undefined && { servings: servings }),
      ...(imageIds && {
        images: {
          create: imageIds.map((id) => ({
            imageId: id,
          })),
        },
      }),
      tryLaterAt: tryLater ? new Date() : null,
      favoritedAt: favorite ? new Date() : null,
      ingredientGroups: {
        create: ingredientGroups.map((ingredientGroup, index) => ({
          name: ingredientGroup.name ?? null,
          order: index,
          ingredients: {
            create: ingredientGroup.ingredients.map((ingredient, ingredientIndex) => {
              const terms = new Set(ingredient.name.toLocaleLowerCase().split(' ').filter(Boolean));
              const matchingCanonicalIngredient =
                canonicalIngredients.find((canonicalIngredient) =>
                  ingredient.name.toLocaleLowerCase().includes(canonicalIngredient.name),
                ) ??
                canonicalIngredients.find(
                  (canonicalIngredient) =>
                    terms.has(canonicalIngredient.name) ||
                    canonicalIngredient.aliases.some((alias) => terms.has(alias.name)),
                );

              return {
                ...omitUndefined(ingredient),
                order: ingredientIndex,
                canonicalIngredientId:
                  canonicalIngredients.find(
                    (canonicalIngredient) =>
                      canonicalIngredient.name === ingredient.name.toLocaleLowerCase(),
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
            create: instructionGroup.instructions.map((instruction, instructionIndex) => ({
              order: instructionIndex,
              text: instruction.text,
            })),
          },
        })),
      },
      ...(usesRecipes && {
        usesRecipes: {
          connect: usesRecipes.map((id) => ({
            id: id,
          })),
        },
      }),
      ...(tags && {
        tags: {
          create: tags.map((tag) => {
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
      }),
      ...(websitePageId && {
        sourceWebsitePage: {
          connect: {
            id: websitePageId,
          },
        },
      }),
      ...(nutrition && {
        nutrition: {
          create: omitUndefined(nutrition),
        },
      }),
    },
    include: recipeInclude,
  });

  return recipe;
}
