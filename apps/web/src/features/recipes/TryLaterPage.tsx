import { Page } from '#src/components/Page';
import { SearchTextField } from '#src/components/SearchTextField';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, Button, Grid, Typography } from '@mui/material';
import {
  listRecipesQueryOptions,
  useUpdateRecipe,
} from '@repo/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { AddRecipesMenu } from './AddRecipesMenu';
import { EmptyRecipes } from './EmptyRecipes';
import { RecipeCard } from './RecipeCard';

export function TryLaterPage() {
  const navigate = useNavigate();
  const userId = useSignedInUserId();
  const { data: allRecipes, isError } = useSuspenseQuery(
    listRecipesQueryOptions({ userId: userId }),
  );
  const [search, setSearch] = useState('');
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const updateRecipe = useUpdateRecipe();

  const tryLaterRecipes = allRecipes.filter(
    (recipe) => recipe.tryLaterAt !== null,
  );
  const tryLaterRecipeIds = tryLaterRecipes.map((r) => r.id);

  const filteredRecipes = tryLaterRecipes
    .slice()
    .sort((a, b) => {
      const aTime = a.tryLaterAt ? a.tryLaterAt.getTime() : 0;
      const bTime = b.tryLaterAt ? b.tryLaterAt.getTime() : 0;
      return bTime - aTime;
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
      <Button
        size="small"
        startIcon={<AddRoundedIcon />}
        sx={{
          mb: 1.5,
        }}
        onClick={(event) => {
          setAddMenuAnchorEl(event.currentTarget);
        }}
      >
        Add
      </Button>
      <Grid container spacing={2}>
        {filteredRecipes.map((recipe) => (
          <Grid
            key={recipe.id}
            size={{
              xs: 12,
              sm: 6,
              lg: 4,
            }}
          >
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
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
    </Page>
  );
}
