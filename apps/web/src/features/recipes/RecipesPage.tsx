import { Page } from '#src/components/Page';
import { SearchTextField } from '#src/components/SearchTextField';
import { Box, Grid, Typography } from '@mui/material';
import { listRecipesQueryOptions } from '@repo/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
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
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const parsingRecipeImports = useParsingRecipeImports({
    enableRecipeRefreshing: true,
  });
  const { ref, width = 0 } = useResizeObserver<HTMLDivElement>();
  const columns = Math.max(1, Math.floor((width + 16) / (256 + 16)));

  const filteredRecipes = recipes
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
          marginLeft: 'auto',
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={(_event, newLayout: typeof layout | null) => {
            if (newLayout) {
              setLayout(newLayout);
            }
          }}
          aria-label="layout"
        >
          <Tooltip title="List layout" placement="bottom">
            <ToggleButton
              value="list"
              aria-label="left aligned"
              sx={{
                borderRadius: 99,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <TableRowsRoundedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Grid layout" placement="bottom">
            <ToggleButton
              value="grid"
              aria-label="centered"
              sx={{
                borderRadius: 99,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              <ViewModuleRoundedIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>
      {layout === 'grid' ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <RecipeList recipes={filteredRecipes} />
      )}
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
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
      </Grid>
      {!isError && !recipes.length && <EmptyRecipesIntro sx={{ my: 8 }} />}
    </Page>
  );
}
