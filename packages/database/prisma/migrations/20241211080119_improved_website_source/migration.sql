/*
  Warnings:

  - You are about to drop the column `original_url` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "original_url",
ADD COLUMN     "source_website_page_id" UUID;

-- CreateTable
CREATE TABLE "websites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "host" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_pages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "website_id" UUID NOT NULL,

    CONSTRAINT "website_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "websites_host_key" ON "websites"("host");

-- CreateIndex
CREATE UNIQUE INDEX "website_pages_path_website_id_key" ON "website_pages"("path", "website_id");

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_source_website_page_id_fkey" FOREIGN KEY ("source_website_page_id") REFERENCES "website_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_pages" ADD CONSTRAINT "website_pages_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
