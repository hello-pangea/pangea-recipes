/*
  Warnings:

  - A unique constraint covering the columns `[recipe_id,image_id]` on the table `recipe_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recipe_images_recipe_id_image_id_key" ON "recipe_images"("recipe_id", "image_id");
