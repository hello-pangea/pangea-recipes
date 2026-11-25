import { createFileRoute } from '@tanstack/react-router';
import { CanonicalIngredientsPage } from '#/features/canonical-ingredients/CanonicalIngredientPage';

export const Route = createFileRoute('/app/_auth/canonical-ingredients/')({
  component: CanonicalIngredientsPage,
});
