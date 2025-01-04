-- CreateTable
CREATE TABLE "recipe_books" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
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

-- AddForeignKey
ALTER TABLE "recipe_books" ADD CONSTRAINT "recipe_books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_on_recipe_books" ADD CONSTRAINT "recipes_on_recipe_books_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_on_recipe_books" ADD CONSTRAINT "recipes_on_recipe_books_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
