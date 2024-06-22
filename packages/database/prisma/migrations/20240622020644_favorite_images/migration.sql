/*
  Warnings:

  - You are about to drop the column `cover_image_id` on the `recipes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_cover_image_id_fkey";

-- DropIndex
DROP INDEX "recipes_cover_image_id_key";

-- AlterTable
ALTER TABLE "recipe_images" ADD COLUMN     "favorite" BOOLEAN;

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "cover_image_id";
