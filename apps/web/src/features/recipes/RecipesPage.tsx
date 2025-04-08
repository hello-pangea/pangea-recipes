import { Page } from '#src/components/Page';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, Grid, InputBase, Typography } from '@mui/material';
import { getListRecipesQueryOptions } from '@open-zero/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { EmptyRecipes } from './EmptyRecipes';
import { RecipeCard } from './RecipeCard';

export function RecipesPage() {
  const userId = useSignedInUserId();
  const { data: recipes, isError } = useSuspenseQuery(
    getListRecipesQueryOptions({ userId: userId }),
  );
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const columns = Math.max(1, Math.floor((width + 16) / (256 + 16)));

  const filteredRecipes = useMemo(() => {
    if (search) {
      return recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return recipes;
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
        My Recipes
      </Typography>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}
      >
        <Box
          sx={[
            {
              maxWidth: 800,
              borderRadius: 99,
              backgroundColor: (theme) =>
                searchFocused
                  ? theme.vars.palette.background.paper
                  : theme.vars.palette.grey[200],
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              px: 2,
              py: 1,
              gap: 2,
              boxShadow: searchFocused
                ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                : undefined,
            },
            (theme) =>
              theme.applyStyles('dark', {
                backgroundColor: searchFocused
                  ? theme.vars.palette.background.paper
                  : theme.vars.palette.grey[900],
              }),
          ]}
        >
          <SearchRoundedIcon />
          <InputBase
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search for a recipe..."
            sx={{ flex: 1 }}
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={() => {
              setSearchFocused(false);
            }}
          />
        </Box>
      </Box>
      <Grid ref={ref} container spacing={2} columns={columns}>
        {width !== 0 &&
          filteredRecipes.map((recipe) => (
            <Grid key={recipe.id} size={1}>
              <RecipeCard recipeId={recipe.id} />
            </Grid>
          ))}
      </Grid>
      {!isError && !recipes.length && <EmptyRecipes sx={{ mt: 8 }} />}
    </Page>
  );
}
