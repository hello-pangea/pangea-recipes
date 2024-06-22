import { LoadingPage } from '#src/components/LoadingPage';
import { useRecipe } from '@open-zero/features';
import { useParams } from 'react-router-dom';
import { CreateRecipePage } from './CreateRecipePage';

export function EditRecipePage() {
  const { recipeId } = useParams();

  const recipeQuery = useRecipe({
    recipeId: recipeId ?? '',
  });

  if (!recipeQuery.data) {
    return <LoadingPage message="Loading recipe" />;
  }

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
