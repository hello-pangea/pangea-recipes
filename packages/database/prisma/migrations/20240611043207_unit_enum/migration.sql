/*
  Warnings:

  - You are about to drop the column `unit_id` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the `units` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('gram', 'kilogram', 'ounce', 'pound', 'teaspoon', 'tablespoon', 'cup', 'fluid_ounce', 'mililiter', 'centiliter', 'deciliter', 'liter', 'bottle', 'can', 'packet', 'pinch', 'bunch');

-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_unit_id_fkey";

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "unit_id",
ADD COLUMN     "unit" "Unit";

-- DropTable
DROP TABLE "units";
