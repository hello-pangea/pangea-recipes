import type { prisma, Prisma } from '@open-zero/database';
import type { RecipeBook } from '@open-zero/features/recipe-books';

export const recipeBookInclude = {
  members: {
    select: {
      userId: true,
      role: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
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
          firstName: true,
          lastName: true,
        },
      },
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
      firstName: member.user.firstName,
      lastName: member.user.lastName,
    })),
    requests: recipeBookData.requests.map((request) => ({
      ...request,
      firstName: request.user.firstName ?? "Guest",
      lastName: request.user.lastName,
    })),
  };

  return recipeBookDto;
}
