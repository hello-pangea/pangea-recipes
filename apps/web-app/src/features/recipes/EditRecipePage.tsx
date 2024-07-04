import { getRecipeQueryOptions } from '@open-zero/features';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { CreateRecipePage } from './CreateRecipePage';

const route = getRouteApi('/_layout/recipes/$recipeId/edit');

export function EditRecipePage() {
  const { recipeId } = route.useParams();

  const recipeQuery = useSuspenseQuery(getRecipeQueryOptions(recipeId));

  return (
    <CreateRecipePage
      defaultRecipe={{
        id: recipeQuery.data.recipe.id,
        name: recipeQuery.data.recipe.name,
        description: recipeQuery.data.recipe.description,
        usesRecipes:
          recipeQuery.data.recipe.usesRecipes?.map((recipeId) => ({
            recipeId: recipeId,
          })) ?? [],
        cookTime: '',
        prepTime: '',
        image: recipeQuery.data.recipe.images?.at(0)
          ? {
              // @ts-expect-error Wait for typescript 5.5
              url: recipeQuery.data.recipe.images.at(0).url,
              // @ts-expect-error Wait for typescript 5.5
              id: recipeQuery.data.recipe.images.at(0).id,
            }
          : null,
        ingredients: recipeQuery.data.recipe.ingredients.map((ingredient) => ({
          food: {
            name: ingredient.food.name,
            id: ingredient.food.id,
          },
          id: ingredient.id,
          amount: ingredient.amount as unknown as number,
          unit: ingredient.unit,
          notes: ingredient.notes,
        })),
        instructionGroups: recipeQuery.data.recipe.instructionGroups.map(
          (instructionGroup) => ({
            title: instructionGroup.title,
            instructions: instructionGroup.instructions,
          }),
        ),
      }}
    />
  );
}
