import { Stack } from '@mui/material';
import { type RecipeProjected } from '@repo/features/recipes';
import { RecipeCell } from './RecipeCell';

interface Props {
  recipes?: RecipeProjected[];
  compact?: boolean;
}

export function RecipeList({ recipes, compact }: Props) {
  return (
    <Stack>
      {recipes?.map((recipe) => (
        <RecipeCell key={recipe.id} recipe={recipe} compact={compact} />
      ))}
    </Stack>
  );
}
