import { type Prisma } from '#src/lib/prisma.js';
import { type UpdateRecipeDto } from '@open-zero/features';

export async function updateInstructionGroups(data: {
  tx: Prisma.TransactionClient;
  newInstructionGroups: UpdateRecipeDto['instructionGroups'];
  oldInstructionGroups: {
    recipeId: string;
    name: string | null;
    id: string;
    createdAt: Date;
    order: number;
  }[];
  recipeId: string;
}) {
  const { tx, newInstructionGroups, oldInstructionGroups, recipeId } = data;

  if (!newInstructionGroups) {
    return;
  }

  const existingInstructionGroupIds = oldInstructionGroups.map(
    (group) => group.id,
  );

  const instructionGroupsToDelete = oldInstructionGroups.filter(
    (group) => !newInstructionGroups.some((g) => g.id === group.id),
  );

  const instructionGroupsToUpdate = newInstructionGroups.filter(
    (group) => group.id && existingInstructionGroupIds.includes(group.id),
  );

  const instructionGroupsToCreate = newInstructionGroups.filter(
    (group) => !group.id,
  );

  if (instructionGroupsToDelete.length) {
    await tx.instructionGroup.deleteMany({
      where: {
        id: {
          in: instructionGroupsToDelete.map((group) => group.id),
        },
      },
    });
  }

  if (instructionGroupsToCreate.length) {
    await Promise.all(
      instructionGroupsToCreate.map(async (instructionGroup) => {
        const index = newInstructionGroups.indexOf(instructionGroup);

        return tx.instructionGroup.create({
          data: {
            recipeId: recipeId,
            name: instructionGroup.name ?? null,
            order: index,
            instructions: {
              create: instructionGroup.instructions.map(
                (instruction, index) => ({
                  order: index,
                  text: instruction.text,
                }),
              ),
            },
          },
        });
      }),
    );
  }

  if (instructionGroupsToUpdate.length) {
    await Promise.all(
      instructionGroupsToUpdate.map(async (group) => {
        const index = newInstructionGroups.indexOf(group);

        return tx.instructionGroup.update({
          where: {
            id: group.id,
          },
          data: {
            name: group.name ?? null,
            order: index,
            instructions: {
              deleteMany: {},
              create: group.instructions.map((instruction, index) => ({
                order: index,
                text: instruction.text,
              })),
            },
          },
        });
      }),
    );
  }
}
