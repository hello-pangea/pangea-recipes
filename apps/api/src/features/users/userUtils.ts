import { prisma } from '@open-zero/database';

export async function claimRecipeBookInvites(user: {
  email: string;
  id: string;
}) {
  const now = new Date();

  const recipeBookInvites = await prisma.recipeBookInvite.findMany({
    where: {
      inviteeEmail: user.email,
    },
  });

  await prisma.$transaction(async (prisma) => {
    await prisma.recipeBookInvite.updateMany({
      where: {
        inviteeEmail: user.email,
      },
      data: {
        claimedAt: now,
      },
    });

    await prisma.recipeBookMember.createMany({
      data: recipeBookInvites.map((invite) => ({
        recipeBookId: invite.recipeBookId,
        userId: user.id,
        role: invite.role,
      })),
    });
  });
}
