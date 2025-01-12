import type { prisma, Prisma } from '@open-zero/database';
import type { RecipeBook } from '@open-zero/features/recipes-books';

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
  };

  return recipeBookDto;
}
