/*
  Warnings:

  - The `unit` column on the `ingredients` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "theme_preference" SET DEFAULT 'system';

-- DropEnum
DROP TYPE "Unit";
