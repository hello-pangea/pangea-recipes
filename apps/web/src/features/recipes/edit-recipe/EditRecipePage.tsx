import { getRecipeQueryOptions } from '@open-zero/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { CreateRecipePage, type RecipeFormInputs } from './CreateRecipePage';

const route = getRouteApi('/app/_layout/recipes_/$recipeId/edit');

export function EditRecipePage() {
  const { recipeId } = route.useParams();

  const { data: recipe } = useSuspenseQuery(getRecipeQueryOptions(recipeId));

  return (
    <CreateRecipePage
      defaultRecipe={{
        id: recipe.id,
        recipeName: recipe.name,
        description: recipe.description,
        usesRecipes:
          recipe.usesRecipes?.map((recipeId) => ({
            recipeId: recipeId,
          })) ?? [],
        cookTime:
          recipe.cookTime === null
            ? ''
            : String(Math.round(recipe.cookTime / 60)),
        prepTime:
          recipe.prepTime === null
            ? ''
            : String(Math.round(recipe.prepTime / 60)),
        servings: recipe.servings ? String(recipe.servings) : '',
        image: recipe.images?.at(0)
          ? {
              // @ts-expect-error Wait for typescript 5.5
              url: recipe.images.at(0).url,
              // @ts-expect-error Wait for typescript 5.5
              id: recipe.images.at(0).id,
            }
          : null,
        ingredientGroups: recipe.ingredientGroups.map((ingredientGroup) => ({
          id: ingredientGroup.id,
          name: ingredientGroup.name,
          ingredients: ingredientGroup.ingredients.map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            quantity: ingredient.quantity as unknown as number,
            unit: ingredient.unit,
            notes: ingredient.notes,
          })),
        })),
        instructionGroups: recipe.instructionGroups.map((instructionGroup) => ({
          id: instructionGroup.id,
          name: instructionGroup.name,
          instructions: instructionGroup.instructions,
        })),
        nutrition: recipe.nutrition as RecipeFormInputs['nutrition'],
      }}
    />
  );
}
