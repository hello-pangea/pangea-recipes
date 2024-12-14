import { CreateCanonicalIngredientPage } from '#src/features/canonical-ingredients/CreateCanonicalIngredientPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/canonical-ingredients/new')({
  component: CreateCanonicalIngredientPage,
});
