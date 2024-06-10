/*
  Warnings:

  - You are about to drop the column `recipe_id` on the `instructions` table. All the data in the column will be lost.
  - Added the required column `instruction_group_id` to the `instructions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "instructions" DROP CONSTRAINT "instructions_recipe_id_fkey";

-- AlterTable
ALTER TABLE "instructions" DROP COLUMN "recipe_id",
ADD COLUMN     "instruction_group_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "instruction_groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "sort" TEXT NOT NULL,
    "recipe_id" UUID NOT NULL,

    CONSTRAINT "instruction_groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "instruction_groups" ADD CONSTRAINT "instruction_groups_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructions" ADD CONSTRAINT "instructions_instruction_group_id_fkey" FOREIGN KEY ("instruction_group_id") REFERENCES "instruction_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
