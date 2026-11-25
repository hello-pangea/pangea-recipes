import { type Prisma } from '@repo/database';
import { updateRecipeContract } from '@repo/features/recipes';
import type z from 'zod';
import { omitUndefined } from '../../lib/omitUndefined.ts';

export async function updateIngredientGroups(data: {
  tx: Prisma.TransactionClient;
  newIngredientGroups: z.infer<typeof updateRecipeContract.body.shape.ingredientGroups>;
  oldIngredientGroups: {
    recipeId: string;
    name: string | null;
    id: string;
    createdAt: Date;
    order: number;
  }[];
  recipeId: string;
}) {
  const { tx, newIngredientGroups, oldIngredientGroups, recipeId } = data;

  if (!newIngredientGroups) {
    return;
  }

  let ingredientTerms = newIngredientGroups.flatMap((group) =>
    group.ingredients.map((ingredient) => ingredient.name.toLocaleLowerCase()),
  );

  ingredientTerms.push(...ingredientTerms.flatMap((term) => term.split(' ')));

  ingredientTerms = [...new Set(ingredientTerms.filter(Boolean))];

  const conditions: Prisma.CanonicalIngredientWhereInput[] = ingredientTerms.flatMap((term) => [
    { name: { contains: term, mode: 'insensitive' } },
    { aliases: { some: { name: { contains: term, mode: 'insensitive' } } } },
  ]);

  const canonicalIngredients = await tx.canonicalIngredient.findMany({
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

  const existingIngredientGroupIds = new Set(oldIngredientGroups.map((group) => group.id));

  const ingredientGroupsToDelete = oldIngredientGroups.filter(
    (group) => !newIngredientGroups.some((g) => g.id === group.id),
  );

  const ingredientGroupsToUpdate = newIngredientGroups.filter(
    (group): group is typeof group & { id: string } =>
      group.id !== undefined && existingIngredientGroupIds.has(group.id),
  );

  const ingredientGroupsToCreate = newIngredientGroups.filter((group) => !group.id);

  if (ingredientGroupsToDelete.length > 0) {
    await tx.ingredientGroup.deleteMany({
      where: {
        id: {
          in: ingredientGroupsToDelete.map((group) => group.id),
        },
      },
    });
  }

  if (ingredientGroupsToCreate.length > 0) {
    await Promise.all(
      ingredientGroupsToCreate.map(async (ingredientGroup) => {
        const index = newIngredientGroups.indexOf(ingredientGroup);

        return tx.ingredientGroup.create({
          data: {
            recipeId: recipeId,
            name: ingredientGroup.name ?? null,
            order: index,
            ingredients: {
              create: ingredientGroup.ingredients.map((ingredient, ingredientIndex) => {
                const terms = new Set(
                  ingredient.name.toLocaleLowerCase().split(' ').filter(Boolean),
                );
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
                  canonicalIngredientId: matchingCanonicalIngredient?.id ?? null,
                };
              }),
            },
          },
        });
      }),
    );
  }

  if (ingredientGroupsToUpdate.length > 0) {
    await Promise.all(
      ingredientGroupsToUpdate.map(async (group) => {
        const index = newIngredientGroups.indexOf(group);

        return tx.ingredientGroup.update({
          where: {
            id: group.id,
          },
          data: {
            name: group.name ?? null,
            order: index,
            ingredients: {
              deleteMany: {},
              create: group.ingredients.map((ingredient, ingredientIndex) => {
                const terms = new Set(
                  ingredient.name.toLocaleLowerCase().split(' ').filter(Boolean),
                );
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
                  canonicalIngredientId: matchingCanonicalIngredient?.id ?? null,
                };
              }),
            },
          },
        });
      }),
    );
  }
}
