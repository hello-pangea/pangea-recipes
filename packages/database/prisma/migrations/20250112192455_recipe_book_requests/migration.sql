-- CreateTable
CREATE TABLE "recipe_book_requests" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipe_book_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "accepted_at" TIMESTAMP(3),

    CONSTRAINT "recipe_book_requests_pkey" PRIMARY KEY ("user_id","recipe_book_id")
);

-- AddForeignKey
ALTER TABLE "recipe_book_requests" ADD CONSTRAINT "recipe_book_requests_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_requests" ADD CONSTRAINT "recipe_book_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
