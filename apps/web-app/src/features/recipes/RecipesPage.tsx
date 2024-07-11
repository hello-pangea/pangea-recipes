import { ButtonLink } from '#src/components/ButtonLink';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, Grid, Typography } from '@mui/material';
import { getListRecipesQueryOptions } from '@open-zero/features';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthRequired } from '../auth/useAuth';
import { RecipeCard } from './RecipeCard';

export function RecipesPage() {
  const { user } = useAuthRequired();
  const recipesQuery = useSuspenseQuery(
    getListRecipesQueryOptions({ userId: user.id }),
  );

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
        {recipesQuery.data.recipes.map((recipe) => (
          <Grid item key={recipe.id} xs={12} md={6} lg={4}>
            <RecipeCard recipeId={recipe.id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
