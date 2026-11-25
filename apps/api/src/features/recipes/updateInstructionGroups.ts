import { type Prisma } from '@repo/database';
import { updateRecipeContract } from '@repo/features/recipes';
import { z } from 'zod';

export async function updateInstructionGroups(data: {
  tx: Prisma.TransactionClient;
  newInstructionGroups: z.infer<typeof updateRecipeContract.body.shape.instructionGroups>;
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

  const existingInstructionGroupIds = new Set(oldInstructionGroups.map((group) => group.id));

  const instructionGroupsToDelete = oldInstructionGroups.filter(
    (group) => !newInstructionGroups.some((g) => g.id === group.id),
  );

  const instructionGroupsToUpdate = newInstructionGroups.filter(
    (group): group is typeof group & { id: string } =>
      group.id !== undefined && existingInstructionGroupIds.has(group.id),
  );

  const instructionGroupsToCreate = newInstructionGroups.filter((group) => !group.id);

  if (instructionGroupsToDelete.length > 0) {
    await tx.instructionGroup.deleteMany({
      where: {
        id: {
          in: instructionGroupsToDelete.map((group) => group.id),
        },
      },
    });
  }

  if (instructionGroupsToCreate.length > 0) {
    await Promise.all(
      instructionGroupsToCreate.map(async (instructionGroup) => {
        const index = newInstructionGroups.indexOf(instructionGroup);

        return tx.instructionGroup.create({
          data: {
            recipeId: recipeId,
            name: instructionGroup.name ?? null,
            order: index,
            instructions: {
              create: instructionGroup.instructions.map((instruction, instructionIndex) => ({
                order: instructionIndex,
                text: instruction.text,
              })),
            },
          },
        });
      }),
    );
  }

  if (instructionGroupsToUpdate.length > 0) {
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
              create: group.instructions.map((instruction, instructionIndex) => ({
                order: instructionIndex,
                text: instruction.text,
              })),
            },
          },
        });
      }),
    );
  }
}
