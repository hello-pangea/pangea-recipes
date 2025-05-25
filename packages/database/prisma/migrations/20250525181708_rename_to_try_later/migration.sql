/*
  Warnings:

  - You are about to drop the column `to_try` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "to_try",
ADD COLUMN     "try_later" BOOLEAN NOT NULL DEFAULT false;
