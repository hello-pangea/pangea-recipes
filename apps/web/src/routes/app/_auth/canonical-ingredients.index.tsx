import { createFileRoute } from '@tanstack/react-router';
import { CanonicalIngredientsPage } from '#src/features/canonical-ingredients/CanonicalIngredientPage';

export const Route = createFileRoute('/app/_auth/canonical-ingredients/')({
  component: CanonicalIngredientsPage,
});
