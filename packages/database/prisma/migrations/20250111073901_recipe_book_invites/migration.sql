-- CreateTable
CREATE TABLE "recipe_book_invites" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitee_email_address" TEXT NOT NULL,
    "recipe_book_id" UUID NOT NULL,
    "invited_by_user_id" UUID NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "recipe_book_invites_pkey" PRIMARY KEY ("invitee_email_address","recipe_book_id")
);

-- AddForeignKey
ALTER TABLE "recipe_book_invites" ADD CONSTRAINT "recipe_book_invites_recipe_book_id_fkey" FOREIGN KEY ("recipe_book_id") REFERENCES "recipe_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_book_invites" ADD CONSTRAINT "recipe_book_invites_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
