import { Prisma, prisma } from '@repo/database';
import type { createRecipeContract } from '@repo/features/recipes';
import type z from 'zod';
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
      tryLaterAt: tryLater ? new Date() : null,
      favoritedAt: favorite ? new Date() : null,
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
            create: instructionGroup.instructions.map((instruction, index) => ({
              order: index,
              text: instruction.text,
            })),
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

  return recipe;
}
