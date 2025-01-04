/*
  Warnings:

  - You are about to drop the column `user_id` on the `recipe_books` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "recipe_books" DROP CONSTRAINT "recipe_books_user_id_fkey";

-- AlterTable
ALTER TABLE "recipe_books" DROP COLUMN "user_id",
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "recipe_books" ADD CONSTRAINT "recipe_books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
