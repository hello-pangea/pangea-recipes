-- CreateTable
CREATE TABLE "recipe_nutrition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipe_id" UUID NOT NULL,
    "calories" INTEGER,
    "total_fat_g" DECIMAL(65,30),
    "unsaturated_fat_g" DECIMAL(65,30),
    "saturated_fat_g" DECIMAL(65,30),
    "trans_fat_g" DECIMAL(65,30),
    "carbs_g" DECIMAL(65,30),
    "protein_g" DECIMAL(65,30),
    "fiber_g" DECIMAL(65,30),
    "sugar_g" DECIMAL(65,30),
    "sodium_mg" DECIMAL(65,30),
    "iron_mg" DECIMAL(65,30),
    "calcium_mg" DECIMAL(65,30),
    "potassium_mg" DECIMAL(65,30),
    "cholesterol_mg" DECIMAL(65,30),

    CONSTRAINT "recipe_nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipe_nutrition_recipe_id_key" ON "recipe_nutrition"("recipe_id");

-- AddForeignKey
ALTER TABLE "recipe_nutrition" ADD CONSTRAINT "recipe_nutrition_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
