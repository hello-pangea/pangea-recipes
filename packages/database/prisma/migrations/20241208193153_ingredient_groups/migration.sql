/*
  Warnings:

  - You are about to drop the column `recipe_id` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `sort` on the `instruction_groups` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `instruction_groups` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `instructions` table. All the data in the column will be lost.
  - Added the required column `ingredient_group_id` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `instruction_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `instructions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Unit" ADD VALUE 'clove';
ALTER TYPE "Unit" ADD VALUE 'whole';
ALTER TYPE "Unit" ADD VALUE 'slice';
ALTER TYPE "Unit" ADD VALUE 'drop';
ALTER TYPE "Unit" ADD VALUE 'dash';
ALTER TYPE "Unit" ADD VALUE 'stick';
ALTER TYPE "Unit" ADD VALUE 'piece';

-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_recipe_id_fkey";

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "recipe_id",
ADD COLUMN     "ingredient_group_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "instruction_groups" DROP COLUMN "sort",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "instructions" DROP COLUMN "step",
ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ingredient_groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "order" INTEGER NOT NULL,
    "recipe_id" UUID NOT NULL,

    CONSTRAINT "ingredient_groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ingredient_groups" ADD CONSTRAINT "ingredient_groups_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_ingredient_group_id_fkey" FOREIGN KEY ("ingredient_group_id") REFERENCES "ingredient_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
