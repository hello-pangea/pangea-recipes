/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'editor', 'viewer');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT;

-- CreateTable
CREATE TABLE "recipe_books" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "recipe_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes_on_recipe_books" (
    "recipe_id" UUID NOT NULL,
    "recipe_book_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipes_on_recipe_books_pkey" PRIMARY KEY ("recipe_id","recipe_book_id")
);

-- CreateTable
CREATE TABLE "recipe_book_members" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "recipe_book_id" UUID NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "recipe_book_members_pkey" PRIMARY KEY ("user_id","recipe_book_id")
);

-- CreateTable
CREATE TABLE "recipe_book_invites" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitee_email_address" TEXT NOT NULL,
    "recipe_book_id" UUID NOT NULL,
    "invited_by_user_id" UUID NOT NULL,
    "clerk_invite_id" TEXT,
    "role" "Role" NOT NULL,
    "claimed_at" TIMESTAMP(3),

    CONSTRAINT "recipe_book_invites_pkey" PRIMARY KEY ("invitee_email_address","recipe_book_id")
);

-- CreateTable
CREATE TABLE "recipe_book_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipe_book_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "declined_at" TIMESTAMP(3),

    CONSTRAINT "recipe_book_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipes_on_recipe_books" ADD CONSTRAINT "recipes_on_recipe_books_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_on_recipe_books" ADD CONSTRAINT "recipes_on_recipe_books_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_members" ADD CONSTRAINT "recipe_book_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_members" ADD CONSTRAINT "recipe_book_members_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_invites" ADD CONSTRAINT "recipe_book_invites_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_invites" ADD CONSTRAINT "recipe_book_invites_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_requests" ADD CONSTRAINT "recipe_book_requests_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_requests" ADD CONSTRAINT "recipe_book_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
