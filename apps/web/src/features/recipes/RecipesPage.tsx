import { Page } from '#src/components/Page';
import { SearchTextField } from '#src/components/SearchTextField';
import { Box, Grid, Typography } from '@mui/material';
import { listRecipesQueryOptions } from '@repo/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { RecipeImportCard } from '../recipe-imports/RecipeImportCard';
import { useParsingRecipeImports } from '../recipe-imports/useParsingRecipeImports';
import { EmptyRecipesIntro } from './EmptyRecipesIntro';
import { RecipeCard } from './RecipeCard';

export function RecipesPage() {
  const userId = useSignedInUserId();
  const { data: recipes, isError } = useSuspenseQuery(
    listRecipesQueryOptions({ userId: userId }),
  );
  const [search, setSearch] = useState('');
  const parsingRecipeImports = useParsingRecipeImports({
    enableRecipeRefreshing: true,
  });
  const { ref, width = 0 } = useResizeObserver<HTMLDivElement>();
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
        <SearchTextField
          value={search}
          onChange={setSearch}
          placeholder="Search for a recipe..."
        />
      </Box>
      {(parsingRecipeImports?.length ?? 0) > 0 && (
        <Grid
          container
          spacing={2}
          columns={columns}
          sx={{
            mb: 2,
          }}
        >
          {width !== 0 &&
            parsingRecipeImports?.map((recipeImport) => (
              <Grid key={recipeImport.id} size={1}>
                <RecipeImportCard recipeImport={recipeImport} />
              </Grid>
            ))}
        </Grid>
      )}
      <Grid ref={ref} container spacing={2} columns={columns}>
        {width !== 0 &&
          filteredRecipes.map((recipe) => (
            <Grid key={recipe.id} size={1}>
              <RecipeCard recipeId={recipe.id} />
            </Grid>
          ))}
      </Grid>
      {!isError && !recipes.length && <EmptyRecipesIntro sx={{ my: 8 }} />}
    </Page>
  );
}
