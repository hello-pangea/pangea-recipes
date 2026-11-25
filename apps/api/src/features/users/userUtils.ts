import { prisma } from '@repo/database';

export async function claimRecipeBookInvites(user: { email: string; id: string }) {
  const now = new Date();

  const recipeBookInvites = await prisma.recipeBookInvite.findMany({
    where: {
      inviteeEmail: user.email,
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.recipeBookInvite.updateMany({
      where: {
        inviteeEmail: user.email,
      },
      data: {
        claimedAt: now,
      },
    });

    await tx.recipeBookMember.createMany({
      data: recipeBookInvites.map((invite) => ({
        recipeBookId: invite.recipeBookId,
        userId: user.id,
        role: invite.role,
      })),
    });
  });
}
