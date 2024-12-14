/*
  Warnings:

  - You are about to drop the column `food_id` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the `foods` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "foods" DROP CONSTRAINT "foods_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_food_id_fkey";

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "food_id",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;

-- DropTable
DROP TABLE "foods";

-- CreateTable
CREATE TABLE "canonical_ingredients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "icon_id" UUID,

    CONSTRAINT "canonical_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canonical_ingredient_aliases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "canonical_ingredient_id" UUID NOT NULL,

    CONSTRAINT "canonical_ingredient_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "canonical_ingredients_name_key" ON "canonical_ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "canonical_ingredient_aliases_name_key" ON "canonical_ingredient_aliases"("name");

-- AddForeignKey
ALTER TABLE "canonical_ingredients" ADD CONSTRAINT "canonical_ingredients_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canonical_ingredient_aliases" ADD CONSTRAINT "canonical_ingredient_aliases_canonical_ingredient_id_fkey" FOREIGN KEY ("canonical_ingredient_id") REFERENCES "canonical_ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
