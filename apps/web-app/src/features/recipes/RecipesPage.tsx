import { Page } from '#src/components/Page';
import { RouterButton } from '#src/components/RouterButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid2, Typography } from '@mui/material';
import { getListRecipesQueryOptions } from '@open-zero/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { RecipeCard } from './RecipeCard';

export function RecipesPage() {
  const userId = useSignedInUserId();
  const recipesQuery = useSuspenseQuery(
    getListRecipesQueryOptions({ userId: userId }),
  );

  return (
    <Page>
      <Typography
        variant="h1"
        sx={{ mb: 4, textAlign: 'center', mt: { xs: 0, sm: 4 } }}
      >
        My Recipes
      </Typography>
      <RouterButton
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        to="/recipes/new"
        size="small"
      >
        New recipe
      </RouterButton>
      <Grid2 container spacing={2}>
        {recipesQuery.data.recipes.map((recipe) => (
          <Grid2
            key={recipe.id}
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
          >
            <RecipeCard recipeId={recipe.id} />
          </Grid2>
        ))}
      </Grid2>
    </Page>
  );
}
