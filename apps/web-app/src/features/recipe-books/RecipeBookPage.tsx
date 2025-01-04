import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Box, Grid2, IconButton, Typography } from '@mui/material';
import { useRecipes } from '@open-zero/features/recipes';
import { getRecipeBookQueryOptions } from '@open-zero/features/recipes-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { RecipeCard } from '../recipes/RecipeCard';
import { RecipeBookMoreMenu } from './RecipeBookMoreMenu';

const route = getRouteApi('/_layout/recipe-books/$recipeBookId');

export function RecipeBookPage() {
  const { recipeBookId } = route.useParams();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const { data: recipes } = useRecipes({ options: { recipeBookId } });

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const recipeBookQuery = useSuspenseQuery(
    getRecipeBookQueryOptions(recipeBookId),
  );

  const recipeBook = recipeBookQuery.data.recipeBook;

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      <Grid2 container spacing={2} sx={{ mb: 2 }}>
        <Grid2
          size={{
            xs: 12,
          }}
          sx={{
            maxWidth: 650,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h1">{recipeBook.name}</Typography>
            </Box>
            <IconButton
              id="more-button"
              aria-controls={moreMenuOpen ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={moreMenuOpen ? 'true' : undefined}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setMoreMenuAnchorEl(event.currentTarget);
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              <MoreVertRoundedIcon />
            </IconButton>
          </Box>
          <Typography>{recipeBook.description}</Typography>
        </Grid2>
      </Grid2>
      <Grid2 container spacing={2}>
        {recipes?.recipes.map((recipe) => (
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
