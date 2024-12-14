import { EditCanonicalIngredientPage } from '#src/features/canonical-ingredients/EditCanonicalIngredientPage';
import { getCanonicalIngredientQueryOptions } from '@open-zero/features';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/canonical-ingredients_/$canonicalIngredientId/edit',
)({
  loader: ({ context: { queryClient }, params: { canonicalIngredientId } }) => {
    return queryClient.ensureQueryData(
      getCanonicalIngredientQueryOptions(canonicalIngredientId),
    );
  },
  component: EditCanonicalIngredientPage,
});
