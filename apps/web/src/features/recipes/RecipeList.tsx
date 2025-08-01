import { Stack } from '@mui/material';
import { type RecipeProjected } from '@open-zero/features/recipes';
import { RecipeCell } from './RecipeCell';

interface Props {
  recipes?: RecipeProjected[];
}

export function RecipeList({ recipes }: Props) {
  return (
    <Stack>
      {recipes?.map((recipe) => (
        <RecipeCell key={recipe.id} recipeId={recipe.id} />
      ))}
    </Stack>
  );
}
