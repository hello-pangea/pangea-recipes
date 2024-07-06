/*
  Warnings:

  - You are about to drop the column `icon_asset_key` on the `foods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "foods" DROP COLUMN "icon_asset_key",
ADD COLUMN     "icon_id" UUID;

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
