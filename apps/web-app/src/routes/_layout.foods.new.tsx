import { CreateFoodPage } from '#src/features/foods/CreateFoodPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/foods/new')({
  component: CreateFoodPage,
});
