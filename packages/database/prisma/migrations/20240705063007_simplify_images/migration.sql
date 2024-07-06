/*
  Warnings:

  - You are about to drop the column `height` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `original_url` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `images` table. All the data in the column will be lost.
  - Added the required column `key` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "height",
DROP COLUMN "original_url",
DROP COLUMN "url",
DROP COLUMN "width",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "original_key" TEXT,
ADD COLUMN     "user_id" UUID;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
