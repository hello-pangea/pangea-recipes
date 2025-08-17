import { Page } from '#src/components/Page';
import { SearchTextField } from '#src/components/SearchTextField';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Box, Button, Grid, Typography } from '@mui/material';
import { listRecipesQueryOptions } from '@repo/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { DisplayMenu } from '../display-preferences/DisplayMenu';
import { useSort } from '../display-preferences/sort';
import { useViewPreference } from '../display-preferences/view';
import { RecipeImportCard } from '../recipe-imports/RecipeImportCard';
import { useParsingRecipeImports } from '../recipe-imports/useParsingRecipeImports';
import { EmptyRecipesIntro } from './EmptyRecipesIntro';
import { RecipeGrid } from './list/RecipeGrid';
import { RecipeList } from './list/RecipeList';

export function RecipesPage() {
  const userId = useSignedInUserId();
  const { data: recipes, isError } = useSuspenseQuery(
    listRecipesQueryOptions({ userId: userId }),
  );
  const [view] = useViewPreference();
  const [sort, setSort] = useSort('recipesSort');
  const [search, setSearch] = useState('');
  const [displayMenuAnchorEl, setDisplayMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const parsingRecipeImports = useParsingRecipeImports({
    enableRecipeRefreshing: true,
  });

  const filteredRecipes = recipes
    .slice()
    .sort((a, b) => {
      if (sort.key === 'date') {
        return sort.direction === 'asc'
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return sort.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    })
    .filter((recipe) =>
      search ? recipe.name.toLowerCase().includes(search.toLowerCase()) : true,
    );

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <Button
          startIcon={<TuneRoundedIcon />}
          onClick={(event) => {
            setDisplayMenuAnchorEl(event.currentTarget);
          }}
          color="inherit"
          size="small"
        >
          Display
        </Button>
      </Box>
      {(parsingRecipeImports?.length ?? 0) > 0 && (
        <Grid
          container
          spacing={2}
          columns={3}
          sx={{
            mb: 2,
          }}
        >
          {parsingRecipeImports?.map((recipeImport) => (
            <Grid key={recipeImport.id} size={1}>
              <RecipeImportCard recipeImport={recipeImport} />
            </Grid>
          ))}
        </Grid>
      )}
      {view === 'grid' ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <RecipeList recipes={filteredRecipes} compact={view === 'compact'} />
      )}
      {!isError && !recipes.length && <EmptyRecipesIntro sx={{ my: 8 }} />}
      <DisplayMenu
        anchorEl={displayMenuAnchorEl}
        onClose={() => {
          setDisplayMenuAnchorEl(null);
        }}
        sort={sort}
        onSortChange={setSort}
      />
    </Page>
  );
}
