import { useResizeObserver } from '@mantine/hooks';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import {
  getRecipeBookQueryOptions,
  useRemoveRecipeFromRecipeBook,
} from '@repo/features/recipe-books';
import { listRecipesQueryOptions } from '@repo/features/recipes';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { RecipeCard } from '../recipes/RecipeCard';
import { RecipeBookMoreMenu } from './RecipeBookMoreMenu';
import { RecipeBookShareButton } from './RecipeBookShareButton';

const route = getRouteApi('/app/_auth/recipe-books/$recipeBookId');

export function RecipeBookPage() {
  const { recipeBookId } = route.useParams();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const removeRecipeFromRecipeBook = useRemoveRecipeFromRecipeBook();
  const { data: recipes } = useQuery(listRecipesQueryOptions({ recipeBookId }));
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [ref, { width }] = useResizeObserver<HTMLDivElement>();
  const columns = Math.max(1, Math.floor((width + 16) / (256 + 16)));

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
      <Grid ref={ref} container spacing={2} columns={columns}>
        {width !== 0 &&
          recipes?.map((recipe) => (
            <Grid key={recipe.id} size={1}>
              <RecipeCard
                recipe={recipe}
                onRemoveFromRecipeBook={() => {
                  removeRecipeFromRecipeBook.mutate({
                    params: {
                      id: recipeBookId,
                      recipeId: recipe.id,
                    },
                  });
                }}
              />
            </Grid>
          ))}
      </Grid>
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
