import { createFileRoute } from '@tanstack/react-router';
import { CreateCanonicalIngredientPage } from '#src/features/canonical-ingredients/CreateCanonicalIngredientPage';

export const Route = createFileRoute('/app/_auth/canonical-ingredients/new')({
  component: CreateCanonicalIngredientPage,
});
