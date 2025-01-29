import { getRecipeBookQueryOptions } from '@open-zero/features/recipe-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { CreateRecipeBookPage } from './CreateRecipeBookPage';

const route = getRouteApi('/app/_layout/recipe-books_/$recipeBookId/edit');

export function EditRecipeBookPage() {
  const { recipeBookId } = route.useParams();

  const { data: recipeBook } = useSuspenseQuery(
    getRecipeBookQueryOptions(recipeBookId),
  );

  return (
    <CreateRecipeBookPage
      defaultRecipeBook={{
        id: recipeBook.id,
        recipeBookName: recipeBook.name,
        description: recipeBook.description,
        access: recipeBook.access,
      }}
    />
  );
}
