import { ButtonLink } from '#src/components/ButtonLink';
import { LoadingPage } from '#src/components/LoadingPage';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, Grid, Typography } from '@mui/material';
import { useRecipes } from '@open-zero/features';
import { useAuthRequired } from '../auth/AuthProvider';
import { RecipeCard } from './RecipeCard';

export function RecipesPage() {
  const { user } = useAuthRequired();
  const recipesQuery = useRecipes({
    options: {
      userId: user.id,
    },
  });

  if (recipesQuery.isPending) {
    return <LoadingPage message="Loading recipes" />;
  }

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Recipes
      </Typography>
      <ButtonLink
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        to="/recipes/new"
        size="small"
      >
        New recipe
      </ButtonLink>
      <Grid container spacing={2}>
        {recipesQuery.data?.recipes.map((recipe) => (
          <Grid item key={recipe.id} xs={12} md={6} lg={4}>
            <RecipeCard recipeId={recipe.id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
