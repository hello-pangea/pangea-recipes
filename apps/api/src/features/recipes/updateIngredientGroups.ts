import { type Prisma } from '#src/lib/prisma.js';
import { type UpdateRecipeDto } from '@open-zero/features';

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
              create: ingredientGroup.ingredients.map((ingredient) => {
                const { food, ...rest } = ingredient;

                return {
                  ...rest,
                  unit: rest.unit ?? undefined,
                  food:
                    'id' in food
                      ? { connect: { id: food.id } }
                      : { create: food },
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
              create: group.ingredients.map((ingredient) => {
                const { food, ...rest } = ingredient;

                return {
                  ...rest,
                  unit: rest.unit ?? undefined,
                  food:
                    'id' in food
                      ? { connect: { id: food.id } }
                      : { create: food },
                };
              }),
            },
          },
        });
      }),
    );
  }
}
