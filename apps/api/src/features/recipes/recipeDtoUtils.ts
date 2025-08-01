import { getFileUrl } from '#src/lib/s3.ts';
import type { prisma, Prisma } from '@repo/database';
import type { Recipe } from '@repo/features/recipes';

export const recipeInclude = {
  ingredientGroups: {
    include: {
      ingredients: {
        include: {
          canonicalIngredient: {
            include: {
              icon: true,
            },
          },
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
  nutrition: true,
  sourceWebsitePage: {
    include: {
      website: true,
    },
  },
} satisfies Prisma.Args<typeof prisma.recipe, 'findUniqueOrThrow'>['include'];

type RecipeData = Prisma.RecipeGetPayload<{
  include: typeof recipeInclude;
}>;

export async function mapToRecipeDto(recipeData: RecipeData): Promise<Recipe> {
  const recipeDto: Recipe = {
    ...recipeData,
    usesRecipes: recipeData.usesRecipes.map((r) => r.usesRecipeId),
    images: await Promise.all(
      recipeData.images.map(async (image) => ({
        id: image.image.id,
        url: await getFileUrl({
          key: image.image.key,
          public: image.image.public,
        }),
        favorite: image.favorite ?? false,
      })),
    ),
    tags: recipeData.tags.map((tag) => ({
      id: tag.tag.id,
      name: tag.tag.name,
    })),
    ingredientGroups: await Promise.all(
      recipeData.ingredientGroups
        .sort((a, b) => {
          return a.order - b.order;
        })
        .map(async (ig) => {
          return {
            ...ig,
            ingredients: await Promise.all(
              ig.ingredients
                .sort((a, b) => a.order - b.order)
                .map(async (i) => {
                  return {
                    ...i,
                    icon_url: i.canonicalIngredient?.icon?.key
                      ? await getFileUrl({
                          key: i.canonicalIngredient.icon.key,
                          public: true,
                        })
                      : null,
                  };
                }),
            ),
          };
        }),
    ),
    instructionGroups: recipeData.instructionGroups.sort((a, b) => {
      return a.order - b.order;
    }),
    websiteSource: recipeData.sourceWebsitePage
      ? {
          title: recipeData.sourceWebsitePage.website.title,
          url: `https://${recipeData.sourceWebsitePage.website.host}${recipeData.sourceWebsitePage.path}`,
        }
      : null,
    nutrition: recipeData.nutrition
      ? {
          calories: recipeData.nutrition.calories,

          totalFatG: recipeData.nutrition.totalFatG?.toNumber() ?? null,
          unsaturatedFatG:
            recipeData.nutrition.unsaturatedFatG?.toNumber() ?? null,
          saturatedFatG: recipeData.nutrition.saturatedFatG?.toNumber() ?? null,
          transFatG: recipeData.nutrition.transFatG?.toNumber() ?? null,

          carbsG: recipeData.nutrition.carbsG?.toNumber() ?? null,
          proteinG: recipeData.nutrition.proteinG?.toNumber() ?? null,
          fiberG: recipeData.nutrition.fiberG?.toNumber() ?? null,
          sugarG: recipeData.nutrition.sugarG?.toNumber() ?? null,

          sodiumMg: recipeData.nutrition.sodiumMg?.toNumber() ?? null,
          ironMg: recipeData.nutrition.ironMg?.toNumber() ?? null,
          calciumMg: recipeData.nutrition.calciumMg?.toNumber() ?? null,
          potassiumMg: recipeData.nutrition.potassiumMg?.toNumber() ?? null,
          cholesterolMg: recipeData.nutrition.cholesterolMg?.toNumber() ?? null,
        }
      : undefined,
  };

  return recipeDto;
}
