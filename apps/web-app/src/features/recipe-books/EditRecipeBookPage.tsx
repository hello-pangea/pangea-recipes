import { getRecipeBookQueryOptions } from '@open-zero/features/recipes-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { CreateRecipeBookPage } from './CreateRecipeBookPage';

const route = getRouteApi('/_layout/recipe-books_/$recipeBookId/edit');

export function EditRecipeBookPage() {
  const { recipeBookId } = route.useParams();

  const recipeBookQuery = useSuspenseQuery(
    getRecipeBookQueryOptions(recipeBookId),
  );

  return (
    <CreateRecipeBookPage
      defaultRecipeBook={{
        id: recipeBookQuery.data.recipeBook.id,
        name: recipeBookQuery.data.recipeBook.name,
        description: recipeBookQuery.data.recipeBook.description,
      }}
    />
  );
}
