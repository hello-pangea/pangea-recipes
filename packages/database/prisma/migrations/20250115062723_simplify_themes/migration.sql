/*
  Warnings:

  - The values [autumn,mint,lavendar,ocean] on the enum `ThemePreference` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ThemePreference_new" AS ENUM ('light', 'dark', 'system');
ALTER TABLE "users" ALTER COLUMN "theme_preference" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "theme_preference" TYPE "ThemePreference_new" USING ("theme_preference"::text::"ThemePreference_new");
ALTER TYPE "ThemePreference" RENAME TO "ThemePreference_old";
ALTER TYPE "ThemePreference_new" RENAME TO "ThemePreference";
DROP TYPE "ThemePreference_old";
ALTER TABLE "users" ALTER COLUMN "theme_preference" SET DEFAULT 'light';
COMMIT;
