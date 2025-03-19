import { EditCanonicalIngredientPage } from '#src/features/canonical-ingredients/EditCanonicalIngredientPage';
import { getCanonicalIngredientQueryOptions } from '@open-zero/features/canonical-ingredients';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/app/_auth/canonical-ingredients_/$canonicalIngredientId/edit',
)({
  loader: ({ context: { queryClient }, params: { canonicalIngredientId } }) => {
    return queryClient.ensureQueryData(
      getCanonicalIngredientQueryOptions(canonicalIngredientId),
    );
  },
  component: EditCanonicalIngredientPage,
});
