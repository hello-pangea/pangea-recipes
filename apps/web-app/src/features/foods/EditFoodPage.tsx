import { getFoodQueryOptions } from '@open-zero/features';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { CreateFoodPage } from './CreateFoodPage';

const route = getRouteApi('/_layout/foods/$foodId/edit');

export function EditFoodPage() {
  const { foodId } = route.useParams();

  const foodQuery = useSuspenseQuery(getFoodQueryOptions(foodId));

  const food = foodQuery.data.food;

  return (
    <CreateFoodPage
      defaultFood={{
        id: food.id,
        name: food.name,
        pluralName: food.pluralName,
        icon: food.icon ?? null,
      }}
    />
  );
}
