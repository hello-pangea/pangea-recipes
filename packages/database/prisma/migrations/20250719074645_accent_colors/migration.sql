-- CreateEnum
CREATE TYPE "AccentColor" AS ENUM ('red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuschia', 'pink', 'rose');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accent_color" "AccentColor" NOT NULL DEFAULT 'indigo';
