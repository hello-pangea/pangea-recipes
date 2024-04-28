import { LoadingPage } from '#src/components/LoadingPage';
import { useRecipe } from '@open-zero/features';
import { useParams } from 'react-router-dom';
import { RecipeCreatePage } from './RecipeCreatePage';

export function RecipeEditPage() {
  const { recipeId } = useParams();

  const recipeQuery = useRecipe({
    recipeId: recipeId ?? '',
  });

  if (!recipeQuery.data) {
    return <LoadingPage message="Loading recipe" />;
  }

  return (
    <RecipeCreatePage
      defaultRecipe={{
        id: recipeQuery.data.recipe.id,
        name: recipeQuery.data.recipe.name,
        description: recipeQuery.data.recipe.description,
        usesRecipes:
          recipeQuery.data.recipe.usesRecipes?.map((recipeId) => ({
            recipeId: recipeId,
          })) ?? [],
        ingredients: recipeQuery.data.recipe.ingredients.map((ingredient) => ({
          ingredientId: ingredient.ingredient.id,
          id: ingredient.id,
          amount: ingredient.amount as unknown as number,
          unitId: ingredient.unitId,
        })),
        instructions: recipeQuery.data.recipe.instructions.map(
          (instruction) => ({
            id: instruction.id,
            text: instruction.text,
          }),
        ),
      }}
    />
  );
}
