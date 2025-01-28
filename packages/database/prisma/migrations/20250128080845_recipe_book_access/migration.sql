-- CreateEnum
CREATE TYPE "RecipeBookAccess" AS ENUM ('private', 'public');

-- AlterTable
ALTER TABLE "recipe_books" ADD COLUMN     "access" "RecipeBookAccess" NOT NULL DEFAULT 'public';
