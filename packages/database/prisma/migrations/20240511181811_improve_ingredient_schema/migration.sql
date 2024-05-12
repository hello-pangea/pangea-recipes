/*
  Warnings:

  - You are about to drop the column `density` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `plural_name` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `ingredient_id` on the `substitutions` table. All the data in the column will be lost.
  - You are about to drop the `recipe_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `substitution_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `food_id` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_id` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_food_id` to the `substitutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toFoodId` to the `substitutions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "substitution_ingredients" DROP CONSTRAINT "substitution_ingredients_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "substitution_ingredients" DROP CONSTRAINT "substitution_ingredients_substitution_id_fkey";

-- DropForeignKey
ALTER TABLE "substitution_ingredients" DROP CONSTRAINT "substitution_ingredients_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "substitutions" DROP CONSTRAINT "substitutions_ingredient_id_fkey";

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "density",
DROP COLUMN "name",
DROP COLUMN "plural_name",
ADD COLUMN     "amount" DECIMAL(65,30),
ADD COLUMN     "food_id" UUID NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "recipe_id" UUID NOT NULL,
ADD COLUMN     "unit_id" UUID;

-- AlterTable
ALTER TABLE "substitutions" DROP COLUMN "ingredient_id",
ADD COLUMN     "from_food_id" UUID NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "toFoodId" UUID NOT NULL;

-- DropTable
DROP TABLE "recipe_ingredients";

-- DropTable
DROP TABLE "substitution_ingredients";

-- CreateTable
CREATE TABLE "foods" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "plural_name" TEXT,
    "density" DECIMAL(65,30),

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "substitutions_from_food_id_fkey" FOREIGN KEY ("from_food_id") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "substitutions_toFoodId_fkey" FOREIGN KEY ("toFoodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
