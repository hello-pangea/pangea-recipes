-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "canonical_ingredient_id" UUID;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_canonical_ingredient_id_fkey" FOREIGN KEY ("canonical_ingredient_id") REFERENCES "canonical_ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
