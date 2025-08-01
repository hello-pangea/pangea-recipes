import type { prisma, Prisma } from '@repo/database';
import type { RecipeBook } from '@repo/features/recipe-books';

export const recipeBookInclude = {
  members: {
    select: {
      userId: true,
      role: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  },
  requests: {
    where: {
      declinedAt: null,
      acceptedAt: null,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  },
  recipes: {
    select: {
      recipeId: true,
    },
  },
  invites: true,
} satisfies Prisma.Args<
  typeof prisma.recipeBook,
  'findUniqueOrThrow'
>['include'];

type RecipeBookData = Prisma.RecipeBookGetPayload<{
  include: typeof recipeBookInclude;
}>;

export function mapToRecipeBookDto(recipeBookData: RecipeBookData): RecipeBook {
  const recipeBookDto: RecipeBook = {
    ...recipeBookData,
    members: recipeBookData.members.map((member) => ({
      ...member,
      name: member.user.name,
    })),
    requests: recipeBookData.requests.map((request) => ({
      ...request,
      name: request.user.name || 'Guest',
    })),
    recipeIds: recipeBookData.recipes.map((recipe) => recipe.recipeId),
  };

  return recipeBookDto;
}
