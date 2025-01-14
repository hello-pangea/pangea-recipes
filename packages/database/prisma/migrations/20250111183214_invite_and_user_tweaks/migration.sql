/*
  Warnings:

  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipe_book_invites" ADD COLUMN     "claimed_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
