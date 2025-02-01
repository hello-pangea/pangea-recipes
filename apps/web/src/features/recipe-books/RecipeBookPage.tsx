import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { Box, Button, Grid2, Typography } from '@mui/material';
import {
  getRecipeBookQueryOptions,
  useRemoveRecipeFromRecipeBook,
} from '@open-zero/features/recipe-books';
import { useRecipes } from '@open-zero/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { RecipeCard } from '../recipes/RecipeCard';
import { RecipeBookMoreMenu } from './RecipeBookMoreMenu';
import { RecipeBookShareButton } from './RecipeBookShareButton';

const route = getRouteApi('/app/_layout/recipe-books/$recipeBookId');

export function RecipeBookPage() {
  const { recipeBookId } = route.useParams();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const removeRecipeFromRecipeBook = useRemoveRecipeFromRecipeBook();
  const { data: recipes } = useRecipes({ options: { recipeBookId } });

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const { data: recipeBook } = useSuspenseQuery(
    getRecipeBookQueryOptions(recipeBookId),
  );

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
          <MenuBookRoundedIcon sx={{ mr: 2 }} />
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
      <Grid2 container spacing={2}>
        {recipes?.map((recipe) => (
          <Grid2
            key={recipe.id}
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
          >
            <RecipeCard
              recipeId={recipe.id}
              onRemoveFromRecipeBook={() => {
                removeRecipeFromRecipeBook.mutate({
                  recipeId: recipe.id,
                  recipeBookId,
                });
              }}
            />
          </Grid2>
        ))}
      </Grid2>
      <RecipeBookMoreMenu
        recipeBookId={recipeBookId}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
      />
    </Box>
  );
}
