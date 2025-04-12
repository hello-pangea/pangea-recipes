import { type Prisma } from '@open-zero/database';
import { type UpdateRecipeDto } from '@open-zero/features/recipes';

export async function updateIngredientGroups(data: {
  tx: Prisma.TransactionClient;
  newIngredientGroups: UpdateRecipeDto['ingredientGroups'];
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

  ingredientTerms.push(
    ...ingredientTerms.map((term) => term.split(' ')).flat(),
  );

  ingredientTerms = [...new Set(ingredientTerms.filter(Boolean))];

  const conditions: Prisma.CanonicalIngredientWhereInput[] =
    ingredientTerms.flatMap((term) => [
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

  const existingIngredientGroupIds = oldIngredientGroups.map(
    (group) => group.id,
  );

  const ingredientGroupsToDelete = oldIngredientGroups.filter(
    (group) => !newIngredientGroups.some((g) => g.id === group.id),
  );

  const ingredientGroupsToUpdate = newIngredientGroups.filter(
    (group) => group.id && existingIngredientGroupIds.includes(group.id),
  );

  const ingredientGroupsToCreate = newIngredientGroups.filter(
    (group) => !group.id,
  );

  if (ingredientGroupsToDelete.length) {
    await tx.ingredientGroup.deleteMany({
      where: {
        id: {
          in: ingredientGroupsToDelete.map((group) => group.id),
        },
      },
    });
  }

  if (ingredientGroupsToCreate.length) {
    await Promise.all(
      ingredientGroupsToCreate.map(async (ingredientGroup) => {
        const index = newIngredientGroups.indexOf(ingredientGroup);

        return tx.ingredientGroup.create({
          data: {
            recipeId: recipeId,
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
                    matchingCanonicalIngredient?.id ?? null,
                };
              }),
            },
          },
        });
      }),
    );
  }

  if (ingredientGroupsToUpdate.length) {
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
              create: group.ingredients.map((ingredient, index) => {
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
                    matchingCanonicalIngredient?.id ?? null,
                };
              }),
            },
          },
        });
      }),
    );
  }
}
