import { Stack } from '@mui/material';
import { type RecipeProjected } from '@repo/features/recipes';
import { RecipeCell } from './RecipeCell';

interface Props {
  recipes?: RecipeProjected[];
  compact?: boolean;
  onRemoveFromRecipeBook?: (recipeId: string) => void;
}

export function RecipeList({
  recipes,
  compact,
  onRemoveFromRecipeBook,
}: Props) {
  return (
    <Stack>
      {recipes?.map((recipe) => (
        <RecipeCell
          key={recipe.id}
          recipe={recipe}
          compact={compact}
          onRemoveFromRecipeBook={() => {
            onRemoveFromRecipeBook?.(recipe.id);
          }}
        />
      ))}
    </Stack>
  );
}
