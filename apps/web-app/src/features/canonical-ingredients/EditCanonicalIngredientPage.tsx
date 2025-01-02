import { getCanonicalIngredientQueryOptions } from '@open-zero/features/canonical-ingredients';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { CreateCanonicalIngredientPage } from './CreateCanonicalIngredientPage';

const route = getRouteApi(
  '/_layout/canonical-ingredients_/$canonicalIngredientId/edit',
);

export function EditCanonicalIngredientPage() {
  const { canonicalIngredientId } = route.useParams();

  const canonicalIngredientQuery = useSuspenseQuery(
    getCanonicalIngredientQueryOptions(canonicalIngredientId),
  );

  const canonicalIngredient = canonicalIngredientQuery.data.canonicalIngredient;

  return (
    <CreateCanonicalIngredientPage
      defaultCanonicalIngredient={{
        id: canonicalIngredient.id,
        name: canonicalIngredient.name,
        icon: canonicalIngredient.icon ?? null,
        aliases: canonicalIngredient.aliases.map((alias) => ({ name: alias })),
      }}
    />
  );
}
