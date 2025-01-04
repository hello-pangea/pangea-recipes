/*
  Warnings:

  - You are about to drop the column `userId` on the `recipe_books` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "recipe_books" DROP CONSTRAINT "recipe_books_userId_fkey";

-- AlterTable
ALTER TABLE "recipe_books" DROP COLUMN "userId";
