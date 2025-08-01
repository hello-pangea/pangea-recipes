import { Grid } from '@mui/material';
import { type RecipeProjected } from '@open-zero/features/recipes';
import { useMeasure } from 'react-use';
import { RecipeCard } from './RecipeCard';

interface Props {
  recipes?: RecipeProjected[];
}

export function RecipeGrid({ recipes }: Props) {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const columns = Math.max(1, Math.floor((width + 16) / (256 + 16)));

  return (
    <Grid ref={ref} container spacing={2} columns={columns}>
      {width !== 0 &&
        recipes?.map((recipe) => (
          <Grid key={recipe.id} size={1}>
            <RecipeCard recipeId={recipe.id} />
          </Grid>
        ))}
    </Grid>
  );
}
