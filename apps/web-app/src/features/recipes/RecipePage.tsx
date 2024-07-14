import { LoadingPage } from '#src/components/LoadingPage';
import { TagEditor } from '#src/components/TagEditor';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Checkbox,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  getRecipeQueryOptions,
  numberToFraction,
  unitRecord,
  useUpdateRecipe,
} from '@open-zero/features';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { RecipeMoreMenu } from './RecipeMoreMenu';

const route = getRouteApi('/_layout/recipes/$recipeId');

export function RecipePage() {
  const { recipeId } = route.useParams();
  const navigate = useNavigate();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const recipeUpdater = useUpdateRecipe();

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const recipeQuery = useSuspenseQuery(getRecipeQueryOptions(recipeId));

  if (!recipeQuery.data) {
    return <LoadingPage message="Loading recipe" />;
  }

  const recipe = recipeQuery.data.recipe;

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid xs={6}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h1">{recipe.name}</Typography>
              {recipe.originalUrl && (
                <Link href={recipe.originalUrl} target="_blank" rel="nofollow">
                  Original source
                </Link>
              )}
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
          <TagEditor
            tags={recipe.tags}
            onTagsChange={(newTags) => {
              console.log('tags changed');
              recipeUpdater.mutate({
                id: recipe.id,
                tags: newTags,
              });
            }}
            sx={{
              mb: 2,
            }}
          />
          <Typography>{recipe.description}</Typography>
        </Grid>
        <Grid xs={6}>
          <Box
            sx={{
              boxShadow:
                'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
              borderRadius: 1,
            }}
          >
            <img
              src={recipe.images?.at(0)?.url}
              height={300}
              width={'100%'}
              style={{
                objectFit: 'cover',
                display: 'block',
                borderRadius: 12,
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Ingredients
          </Typography>
          <Box component="ul" sx={{ mb: 4 }}>
            {recipe.ingredients.map((ingredient) => (
              <Box component={'li'} key={ingredient.id}>
                <Checkbox
                  sx={{
                    p: 0.75,
                    mr: 1,
                  }}
                />
                <Box sx={{ mr: 2, display: 'inline' }}>
                  <img
                    width={24}
                    height={24}
                    src={ingredient.food.icon?.url ?? '/assets/ingredients.svg'}
                  />
                </Box>
                {ingredient.amount !== null && (
                  <b>{numberToFraction(ingredient.amount)}</b>
                )}{' '}
                {ingredient.unit && unitRecord[ingredient.unit]?.name}{' '}
                {ingredient.food.name}
                {ingredient.notes && (
                  <Typography
                    component={'span'}
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      ml: 1,
                      fontWeight: 300,
                    }}
                  >
                    ({ingredient.notes})
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Instructions
          </Typography>
          <Stack component={'ol'} spacing={4} sx={{ maxWidth: '500px' }}>
            {recipe.instructionGroups.map((instructionGroup, index) => (
              <Box component={'li'} key={index}>
                {instructionGroup.title && (
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {instructionGroup.title}
                  </Typography>
                )}
                <Stack component={'ol'} spacing={2} sx={{ maxWidth: '500px' }}>
                  {instructionGroup.instructions.map((instruction, index) => (
                    <Box
                      component={'li'}
                      key={instruction.id}
                      sx={{ display: 'flex' }}
                    >
                      <Typography
                        variant="h1"
                        component="p"
                        sx={{
                          minWidth: 45,
                          color: (theme) => theme.palette.text.secondary,
                        }}
                      >
                        {index + 1}.
                      </Typography>
                      <Typography
                        sx={{
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {instruction.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
      <RecipeMoreMenu
        recipeId={recipe.id}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
        onDelete={() => {
          navigate({ to: '/recipes' });
        }}
      />
    </Box>
  );
}
