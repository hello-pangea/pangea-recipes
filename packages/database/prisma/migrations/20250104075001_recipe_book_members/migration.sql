-- CreateTable
CREATE TABLE "recipe_book_members" (
    "user_id" UUID NOT NULL,
    "recipe_book_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_book_members_pkey" PRIMARY KEY ("user_id","recipe_book_id")
);

-- AddForeignKey
ALTER TABLE "recipe_book_members" ADD CONSTRAINT "recipe_book_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_members" ADD CONSTRAINT "recipe_book_members_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
