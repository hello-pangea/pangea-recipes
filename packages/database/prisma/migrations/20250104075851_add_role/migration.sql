/*
  Warnings:

  - Added the required column `role` to the `recipe_book_members` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'editor', 'viewer');

-- AlterTable
ALTER TABLE "recipe_book_members" ADD COLUMN     "role" "Role" NOT NULL;
