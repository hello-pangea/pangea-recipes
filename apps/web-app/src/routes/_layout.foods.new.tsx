import { NewFoodPage } from '#src/features/foods/NewFoodPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/foods/new')({
  component: NewFoodPage,
});
