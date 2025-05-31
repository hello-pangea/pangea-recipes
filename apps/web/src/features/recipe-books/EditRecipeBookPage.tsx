import { getRecipeBookQueryOptions } from '@open-zero/features/recipe-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { CreateRecipeBookPage } from './CreateRecipeBookPage';

const route = getRouteApi('/app/_auth/recipe-books_/$recipeBookId/edit');

export function EditRecipeBookPage() {
  const { recipeBookId } = route.useParams();

  const { data: recipeBook } = useSuspenseQuery(
    getRecipeBookQueryOptions(recipeBookId),
  );

  return (
    <CreateRecipeBookPage
      updateRecipeBookId={recipeBookId}
      defaultValues={{
        recipeBookName: recipeBook.name,
        description: recipeBook.description,
        access: recipeBook.access,
      }}
    />
  );
}
