import { Page } from '#src/components/Page';
import { getRouteApi } from '@tanstack/react-router';
import { Recipe } from './Recipe';

const route = getRouteApi('/app/_auth/recipes/$recipeId');

export function RecipePage() {
  const { recipeId } = route.useParams();

  return (
    <Page maxWidth="md">
      <Recipe recipeId={recipeId} />
    </Page>
  );
}
