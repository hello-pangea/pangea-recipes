import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import {
  getRecipeBookQueryOptions,
  useAddRecipeToRecipeBook,
  useRemoveRecipeFromRecipeBook,
} from '@repo/features/recipe-books';
import { listRecipesQueryOptions } from '@repo/features/recipes';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { DisplayMenu } from '../display-preferences/DisplayMenu';
import { useSort } from '../display-preferences/sort';
import { useViewPreference } from '../display-preferences/view';
import { AddRecipesMenu } from '../recipes/AddRecipesMenu';
import { RecipeGrid } from '../recipes/list/RecipeGrid';
import { RecipeList } from '../recipes/list/RecipeList';
import { RecipeBookMoreMenu } from './RecipeBookMoreMenu';
import { RecipeBookShareButton } from './RecipeBookShareButton';

const route = getRouteApi('/app/_auth/recipe-books/$recipeBookId');

export function RecipeBookPage() {
  const { recipeBookId } = route.useParams();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const removeRecipeFromRecipeBook = useRemoveRecipeFromRecipeBook();
  const addRecipeToRecipeBook = useAddRecipeToRecipeBook();
  const { data: recipes } = useQuery(listRecipesQueryOptions({ recipeBookId }));
  const [view] = useViewPreference();
  const [sort, setSort] = useSort(`recipeBookSort_${recipeBookId}`, {
    key: 'name',
    direction: 'desc',
  });
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [displayMenuAnchorEl, setDisplayMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const { data: recipeBook } = useSuspenseQuery(
    getRecipeBookQueryOptions(recipeBookId),
  );

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const recipeIds = recipes?.map((r) => r.id) ?? [];

  const filteredRecipes = (recipes ?? []).slice().sort((a, b) => {
    return sort.direction === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  function handleRemoveRecipeFromRecipeBook(recipeId: string) {
    removeRecipeFromRecipeBook.mutate({
      params: {
        id: recipeBookId,
        recipeId: recipeId,
      },
    });
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MenuBookRoundedIcon
            fontSize={isSmall ? 'small' : undefined}
            sx={{ mr: 2 }}
          />
          <Button
            variant="text"
            endIcon={
              <ArrowDropDownRoundedIcon
                sx={{
                  width: 28,
                  height: 28,
                }}
              />
            }
            sx={{
              color: 'inherit',
            }}
            onClick={(event) => {
              setMoreMenuAnchorEl(event.currentTarget);
            }}
            id="more-button"
            aria-controls={moreMenuOpen ? 'more-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={moreMenuOpen ? 'true' : undefined}
          >
            <Typography variant="h1">{recipeBook.name}</Typography>
          </Button>
        </Box>
        <RecipeBookShareButton recipeBookId={recipeBookId} />
      </Box>
      {recipeBook.description && (
        <Typography sx={{ mb: 4 }}>{recipeBook.description}</Typography>
      )}
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
        <RecipeGrid
          recipes={filteredRecipes}
          onRemoveFromRecipeBook={handleRemoveRecipeFromRecipeBook}
        />
      ) : (
        <RecipeList
          recipes={filteredRecipes}
          compact={view === 'compact'}
          onRemoveFromRecipeBook={handleRemoveRecipeFromRecipeBook}
        />
      )}
      <RecipeBookMoreMenu
        recipeBookId={recipeBookId}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
      />
      <AddRecipesMenu
        addedRecipeIds={recipeIds}
        onClose={() => {
          setAddMenuAnchorEl(null);
        }}
        anchorEl={addMenuAnchorEl}
        onToggleRecipe={(recipeId) => {
          const added = recipeIds.includes(recipeId);

          if (added) {
            removeRecipeFromRecipeBook.mutate({
              params: {
                id: recipeBookId,
                recipeId: recipeId,
              },
            });
          } else {
            addRecipeToRecipeBook.mutate({
              params: { id: recipeBookId },
              body: {
                recipeId: recipeId,
              },
            });
          }
        }}
      />
      <DisplayMenu
        disableDateSort
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
    </Box>
  );
}
