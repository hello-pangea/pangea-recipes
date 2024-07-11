-- AlterEnum
ALTER TYPE "ThemePreference" ADD VALUE 'lavendar';

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "original_url" TEXT;
