import { Page } from '#src/components/Page';
import { SearchTextField } from '#src/components/SearchTextField';
import { Box, Grid, Typography } from '@mui/material';
import { listRecipesQueryOptions } from '@repo/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { EmptyRecipes } from './EmptyRecipes';
import { RecipeCard } from './RecipeCard';

export function TryLaterPage() {
  const userId = useSignedInUserId();
  const { data: recipes, isError } = useSuspenseQuery(
    listRecipesQueryOptions({ userId: userId }),
  );
  const [search, setSearch] = useState('');

  const filteredRecipes = useMemo(() => {
    const toTryRecipes = recipes.filter((recipe) => recipe.tryLater);

    if (search) {
      return toTryRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return toTryRecipes;
  }, [recipes, search]);

  return (
    <Page>
      <Typography
        variant="h1"
        sx={{
          mb: {
            xs: 2,
            sm: 4,
          },
          textAlign: 'center',
          mt: { xs: 0, sm: 4 },
        }}
      >
        Recipes To Try Later
      </Typography>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}
      >
        <SearchTextField
          value={search}
          onChange={setSearch}
          placeholder="Search for a recipe..."
        />
      </Box>
      <Grid container spacing={2}>
        {filteredRecipes.map((recipe) => (
          <Grid
            key={recipe.id}
            size={{
              xs: 12,
              sm: 6,
              lg: 4,
            }}
          >
            <RecipeCard recipeId={recipe.id} />
          </Grid>
        ))}
      </Grid>
      {!isError && !recipes.length && <EmptyRecipes sx={{ mt: 8 }} />}
    </Page>
  );
}
