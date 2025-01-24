import { TagEditor } from '#src/components/TagEditor';
import { useWakeLock } from '#src/hooks/useWakeLock';
import BlenderRoundedIcon from '@mui/icons-material/BlenderRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  FormControlLabel,
  FormGroup,
  Grid2,
  IconButton,
  Link,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import {
  getRecipeQueryOptions,
  useUpdateRecipe,
} from '@open-zero/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Ingredient } from './Ingredient';
import { RecipeMoreMenu } from './RecipeMoreMenu';

const route = getRouteApi('/app/_layout/recipes/$recipeId');

export function RecipePage() {
  const { recipeId } = route.useParams();
  const navigate = useNavigate();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const recipeUpdater = useUpdateRecipe();
  const { enqueueSnackbar } = useSnackbar();
  const {
    isSupported: isWakeLockSupported,
    released: isWakeLockReleased,
    request: requestWakeLock,
    release: releaseWakeLock,
  } = useWakeLock({
    onError: () => {
      enqueueSnackbar('Failed to keep screen awake', { variant: 'error' });
    },
  });

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const { data: recipe } = useSuspenseQuery(getRecipeQueryOptions(recipeId));

  const hasCoverImage = (recipe.images?.length ?? 0) > 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 0, sm: 2 } }}>
      <Grid2 container spacing={4} sx={{ mb: 4 }}>
        <Grid2
          size={{
            xs: 12,
            md: hasCoverImage ? 6 : 12,
          }}
        >
          <Stack spacing={4}>
            <Card
              sx={{
                p: { xs: 2, sm: 4 },
                border: 0,
                mx: { xs: -1, sm: 0 },
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h1">{recipe.name}</Typography>
                  {recipe.websiteSource && (
                    <Link
                      href={recipe.websiteSource.url}
                      rel="nofollow"
                      target="_blank"
                      sx={{
                        color: (theme) => theme.palette.text.secondary,
                      }}
                    >
                      {recipe.websiteSource.title}
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
                  recipeUpdater.mutate({
                    id: recipe.id,
                    tags: newTags,
                  });
                }}
                sx={{
                  mb: 2,
                }}
              />
              <Typography sx={{ maxWidth: 500 }}>
                {recipe.description}
              </Typography>
              {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
                <Grid2 container spacing={2} sx={{ mt: 4 }}>
                  {recipe.servings && (
                    <Grid2
                      size={{
                        xs: 12,
                        sm: 4,
                        md: 6,
                        lg: 4,
                      }}
                    >
                      <Stack spacing={2}>
                        <Typography variant="h3">Servings</Typography>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <GroupsRoundedIcon />
                          <Typography>{recipe.servings}</Typography>
                        </Stack>
                      </Stack>
                    </Grid2>
                  )}
                  {recipe.prepTime && (
                    <Grid2
                      size={{
                        xs: 12,
                        sm: 4,
                        md: 6,
                        lg: 4,
                      }}
                    >
                      <Stack spacing={2}>
                        <Typography variant="h3">Prep Time</Typography>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <BlenderRoundedIcon />
                          <Typography>
                            {Math.round(recipe.prepTime / 60)}m
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid2>
                  )}
                  {recipe.cookTime && (
                    <Grid2
                      size={{
                        xs: 12,
                        sm: 4,
                        md: 6,
                        lg: 4,
                      }}
                    >
                      <Stack spacing={2}>
                        <Typography variant="h3">Cook Time</Typography>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <LocalFireDepartmentRoundedIcon />
                          <Typography>
                            {Math.round(recipe.cookTime / 60)}m
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid2>
                  )}
                </Grid2>
              )}
              {isWakeLockSupported && (
                <FormGroup sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isWakeLockReleased === false}
                        onChange={() => {
                          if (isWakeLockReleased === false) {
                            void releaseWakeLock();
                          } else {
                            void requestWakeLock('screen');
                          }
                        }}
                      />
                    }
                    label="Keep screen awake"
                  />
                </FormGroup>
              )}
            </Card>
          </Stack>
        </Grid2>
        {hasCoverImage && (
          <Grid2
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box
              sx={{
                borderRadius: 2,
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                height: 400,
                boxShadow:
                  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
            >
              <img
                src={recipe.images?.at(0)?.url}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  objectPosition: 'center',
                }}
              />
            </Box>
          </Grid2>
        )}
      </Grid2>
      <Grid2 container spacing={2}>
        <Grid2
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography variant="h2" sx={{ mb: 2 }}>
            Ingredients
          </Typography>
          <Stack component={'ul'} spacing={4} sx={{ maxWidth: '500px' }}>
            {recipe.ingredientGroups.map((ingredientGroup) => (
              <Box component={'li'} key={ingredientGroup.id}>
                {recipe.ingredientGroups.length > 1 && ingredientGroup.name && (
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {ingredientGroup.name}
                  </Typography>
                )}
                <Stack component={'ul'}>
                  {ingredientGroup.ingredients.map((ingredient) => (
                    <Ingredient ingredient={ingredient} key={ingredient.id} />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography variant="h2" sx={{ mb: 2 }}>
            Instructions
          </Typography>
          <Stack component={'ol'} spacing={4} sx={{ maxWidth: '500px' }}>
            {recipe.instructionGroups.map((instructionGroup) => (
              <Box component={'li'} key={instructionGroup.id}>
                {recipe.instructionGroups.length > 1 &&
                  instructionGroup.name && (
                    <Typography variant="h3" sx={{ mb: 2 }}>
                      {instructionGroup.name}
                    </Typography>
                  )}
                <Stack component={'ol'} spacing={1} sx={{ maxWidth: '500px' }}>
                  {instructionGroup.instructions.map((instruction, index) => (
                    <Box component={'li'} key={instruction.id}>
                      <Typography
                        sx={{
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        <Typography
                          sx={{
                            color: (theme) => theme.palette.primary.main,
                            fontWeight: 'bold',
                            fontFamily: '"Lora Variable", serif',
                            fontSize: 22,
                          }}
                          component={'span'}
                        >
                          {index + 1}.{' '}
                        </Typography>
                        {instruction.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid2>
      </Grid2>
      <RecipeMoreMenu
        recipeId={recipe.id}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
        onDelete={() => {
          void navigate({ to: '/app/recipes' });
        }}
      />
    </Box>
  );
}
