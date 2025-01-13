/*
  Warnings:

  - The primary key for the `recipe_book_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "recipe_book_requests" DROP CONSTRAINT "recipe_book_requests_pkey",
ADD COLUMN     "declined_at" TIMESTAMP(3),
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "recipe_book_requests_pkey" PRIMARY KEY ("id");
