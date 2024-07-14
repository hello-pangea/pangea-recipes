import { EditFoodPage } from '#src/features/foods/EditFoodPage';
import { getFoodQueryOptions } from '@open-zero/features';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/foods/$foodId/edit')({
  loader: ({ context: { queryClient }, params: { foodId } }) => {
    return queryClient.ensureQueryData(getFoodQueryOptions(foodId));
  },
  component: EditFoodPage,
});
