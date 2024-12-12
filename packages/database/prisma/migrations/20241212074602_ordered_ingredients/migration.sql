/*
  Warnings:

  - Added the required column `order` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
