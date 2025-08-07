/*
  Warnings:

  - You are about to drop the column `favorite` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `try_later` on the `recipes` table. All the data in the column will be lost.

*/
-- 1. Add new nullable timestamp columns
ALTER TABLE "public"."recipes"
  ADD COLUMN "favorited_at" TIMESTAMP(3),
  ADD COLUMN "try_later_at" TIMESTAMP(3);

-- 2. Populate them when the old boolean flags were true
UPDATE "public"."recipes"
  SET "favorited_at" = NOW()
  WHERE "favorite" IS TRUE;

UPDATE "public"."recipes"
  SET "try_later_at" = NOW()
  WHERE "try_later" IS TRUE;

-- 3. Drop the obsolete boolean columns
ALTER TABLE "public"."recipes"
  DROP COLUMN "favorite",
  DROP COLUMN "try_later";
