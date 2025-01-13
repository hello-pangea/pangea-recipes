import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import {
  alpha,
  Box,
  Button,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRecipes } from '@open-zero/features/recipes';
import {
  getRecipeBookQueryOptions,
  useRemoveRecipeFromRecipeBook,
} from '@open-zero/features/recipes-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { RecipeCard } from '../recipes/RecipeCard';
import { RecipeBookMoreMenu } from './RecipeBookMoreMenu';
import { RecipeBookShareDialog } from './RecipeBookShareDialog';

const route = getRouteApi('/_layout/recipe-books/$recipeBookId');

export function RecipeBookPage() {
  const { recipeBookId } = route.useParams();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const removeRecipeFromRecipeBook = useRemoveRecipeFromRecipeBook();
  const { data: recipes } = useRecipes({ options: { recipeBookId } });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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
        }}
      >
        <MenuBookRoundedIcon sx={{ mr: 2 }} />
        <Button
          variant="text"
          endIcon={<ArrowDropDownRoundedIcon />}
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
        {(recipeBook.members.length > 1 || recipeBook.invites.length > 0) && (
          <Tooltip title="Shared">
            <IconButton
              onClick={() => {
                setShareDialogOpen(true);
              }}
              sx={{ ml: 1 }}
            >
              <GroupRoundedIcon
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Typography sx={{ mb: 4 }}>{recipeBook.description}</Typography>
      {recipeBook.requests.length > 0 && (
        <Stack spacing={2}>
          {recipeBook.requests.map((request) => (
            <Box
              key={request.userId}
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                maxWidth: 400,
              }}
            >
              <Typography>
                {request.firstName}
                {request.lastName ? ` ${request.lastName}` : ''} requested to
                join
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Button variant="text">Review</Button>
                <IconButton sx={{ ml: 1 }} size="small">
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
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
      <RecipeBookShareDialog
        recipeBookId={recipeBookId}
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
        }}
      />
    </Box>
  );
}
