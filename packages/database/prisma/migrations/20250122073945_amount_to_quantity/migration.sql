/*
  Warnings:

  - You are about to drop the column `amount` on the `ingredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "amount",
ADD COLUMN     "quantity" DECIMAL(65,30);
