import { CanonicalIngredientsPage } from '#src/features/canonical-ingredients/CanonicalIngredientPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_auth/canonical-ingredients/')({
  component: CanonicalIngredientsPage,
});
