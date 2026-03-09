import { getCanonicalIngredientQueryOptions } from '@repo/features/canonical-ingredients';
import { createFileRoute } from '@tanstack/react-router';
import { EditCanonicalIngredientPage } from '#src/features/canonical-ingredients/EditCanonicalIngredientPage';

export const Route = createFileRoute(
  '/app/_auth/canonical-ingredients_/$canonicalIngredientId/edit',
)({
  loader: ({ context: { queryClient }, params: { canonicalIngredientId } }) => {
    return queryClient.ensureQueryData(getCanonicalIngredientQueryOptions(canonicalIngredientId));
  },
  component: EditCanonicalIngredientPage,
});
