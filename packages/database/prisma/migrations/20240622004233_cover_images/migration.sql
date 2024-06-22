/*
  Warnings:

  - A unique constraint covering the columns `[cover_image_id]` on the table `recipes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "cover_image_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "recipes_cover_image_id_key" ON "recipes"("cover_image_id");

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "recipe_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
