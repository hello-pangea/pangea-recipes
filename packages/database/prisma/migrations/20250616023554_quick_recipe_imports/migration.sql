-- CreateEnum
CREATE TYPE "RecipeImportStatus" AS ENUM ('parsing', 'complete', 'failed');

-- CreateTable
CREATE TABLE "recipe_imports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "status" "RecipeImportStatus" NOT NULL DEFAULT 'parsing',
    "error" TEXT,

    CONSTRAINT "recipe_imports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_imports" ADD CONSTRAINT "recipe_imports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
