import { useResizeObserver } from '@mantine/hooks';
import { Grid } from '@mui/material';
import { type RecipeProjected } from '@repo/features/recipes';
import { RecipeCard } from './RecipeCard';

interface Props {
  recipes?: RecipeProjected[];
}

export function RecipeGrid({ recipes }: Props) {
  const [ref, { width }] = useResizeObserver<HTMLDivElement>();
  const columns = Math.max(1, Math.floor((width + 16) / (256 + 16)));

  return (
    <Grid ref={ref} container spacing={2} columns={columns}>
      {width !== 0 &&
        recipes?.map((recipe) => (
          <Grid key={recipe.id} size={1}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
    </Grid>
  );
}
