import { ButtonLink } from '#src/components/ButtonLink';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, Grid2, Typography } from '@mui/material';
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
    </Box>
  );
}
