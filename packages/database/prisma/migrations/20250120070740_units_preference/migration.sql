-- CreateEnum
CREATE TYPE "UnitsPreference" AS ENUM ('imperial', 'metric');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "units_preference" "UnitsPreference" NOT NULL DEFAULT 'imperial';
