/*
  Warnings:

  - The primary key for the `recipe_book_invites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `invitee_email_address` on the `recipe_book_invites` table. All the data in the column will be lost.
  - Added the required column `invitee_email` to the `recipe_book_invites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe_book_invites" DROP CONSTRAINT "recipe_book_invites_pkey",
DROP COLUMN "invitee_email_address",
ADD COLUMN     "invitee_email" TEXT NOT NULL,
ADD CONSTRAINT "recipe_book_invites_pkey" PRIMARY KEY ("invitee_email", "recipe_book_id");
