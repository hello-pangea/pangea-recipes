-- CreateEnum
CREATE TYPE "ThemePreference" AS ENUM ('light', 'dark', 'autumn');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "theme_preference" "ThemePreference" NOT NULL DEFAULT 'light';
