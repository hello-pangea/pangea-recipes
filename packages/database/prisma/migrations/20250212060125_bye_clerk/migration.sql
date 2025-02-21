/*
  Warnings:

  - You are about to drop the column `clerk_user_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_clerk_user_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clerk_user_id",
ALTER COLUMN "access_role" SET DEFAULT 'user';
