/*
  Warnings:

  - You are about to drop the column `density` on the `foods` table. All the data in the column will be lost.
  - You are about to drop the `substitutions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccessRole" AS ENUM ('user', 'admin');

-- DropForeignKey
ALTER TABLE "substitutions" DROP CONSTRAINT "substitutions_from_food_id_fkey";

-- DropForeignKey
ALTER TABLE "substitutions" DROP CONSTRAINT "substitutions_toFoodId_fkey";

-- AlterTable
ALTER TABLE "foods" DROP COLUMN "density",
ADD COLUMN     "icon_asset_key" TEXT,
ADD COLUMN     "is_official" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "access_role" "AccessRole" NOT NULL;

-- DropTable
DROP TABLE "substitutions";

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
