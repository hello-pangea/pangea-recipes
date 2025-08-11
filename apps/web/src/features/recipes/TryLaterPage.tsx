import { Page } from '#src/components/Page';
import { SearchTextField } from '#src/components/SearchTextField';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Box, Button, Typography } from '@mui/material';
import {
  listRecipesQueryOptions,
  useUpdateRecipe,
} from '@repo/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { DisplayMenu } from '../display-preferences/DisplayMenu';
import { useSort } from '../display-preferences/sort';
import { useViewPreference } from '../display-preferences/view';
import { AddRecipesMenu } from './AddRecipesMenu';
import { EmptyRecipes } from './EmptyRecipes';
import { RecipeGrid } from './list/RecipeGrid';
import { RecipeList } from './list/RecipeList';

export function TryLaterPage() {
  const navigate = useNavigate();
  const userId = useSignedInUserId();
  const { data: allRecipes, isError } = useSuspenseQuery(
    listRecipesQueryOptions({ userId: userId }),
  );
  const [view] = useViewPreference();
  const [sort, setSort] = useSort('tryLaterSort');
  const [search, setSearch] = useState('');
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [displayMenuAnchorEl, setDisplayMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const updateRecipe = useUpdateRecipe();

  const tryLaterRecipes = allRecipes.filter(
    (recipe) => recipe.tryLaterAt !== null,
  );
  const tryLaterRecipeIds = tryLaterRecipes.map((r) => r.id);

  const filteredRecipes = tryLaterRecipes
    .slice()
    .sort((a, b) => {
      if (sort.key === 'date') {
        const aTime = a.tryLaterAt?.getTime() ?? 0;
        const bTime = b.tryLaterAt?.getTime() ?? 0;

        return sort.direction === 'asc' ? aTime - bTime : bTime - aTime;
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Button
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={(event) => {
            setAddMenuAnchorEl(event.currentTarget);
          }}
        >
          Add
        </Button>
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
      {view === 'grid' ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <RecipeList recipes={filteredRecipes} compact={view === 'compact'} />
      )}
      {!isError && !tryLaterRecipes.length && <EmptyRecipes sx={{ mt: 8 }} />}
      <AddRecipesMenu
        addedRecipeIds={tryLaterRecipeIds}
        onClose={() => {
          setAddMenuAnchorEl(null);
        }}
        anchorEl={addMenuAnchorEl}
        onToggleRecipe={(recipeId) => {
          const added = tryLaterRecipeIds.includes(recipeId);

          updateRecipe.mutate({
            params: { id: recipeId },
            body: {
              tryLater: !added,
            },
          });
        }}
        onNewRecipe={() => {
          void navigate({
            to: '/app/recipes/new',
            search: { tryLater: true },
          });
        }}
      />
      <DisplayMenu
        anchorEl={displayMenuAnchorEl}
        onClose={() => {
          setDisplayMenuAnchorEl(null);
        }}
        sort={sort}
        onSortChange={(newSort) => {
          setSort(newSort);
          localStorage.setItem('recipesSort', JSON.stringify(newSort));
        }}
      />
    </Page>
  );
}
