import { TagEditor } from '#src/components/TagEditor';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Checkbox,
  Grid2,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
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

  const recipe = recipeQuery.data.recipe;

  const hasCoverImage = (recipe.images?.length ?? 0) > 0;

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      <Grid2 container spacing={2} sx={{ mb: 2 }}>
        <Grid2
          size={{
            xs: hasCoverImage ? 6 : 12,
          }}
          sx={{
            pb: 4,
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
          <Typography sx={{ maxWidth: 500 }}>{recipe.description}</Typography>
        </Grid2>
        {hasCoverImage && (
          <Grid2
            size={{
              xs: 6,
            }}
          >
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
                    <Box
                      component={'li'}
                      key={ingredient.id}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Checkbox
                        sx={{
                          p: 0.75,
                          mr: 1.5,
                        }}
                      />
                      <Box sx={{ mr: 1.5 }}>
                        <img
                          width={24}
                          height={24}
                          src={
                            ingredient.food.icon?.url ??
                            '/assets/ingredients.svg'
                          }
                        />
                      </Box>
                      <Box>
                        {ingredient.amount !== null && (
                          <b>{numberToFraction(ingredient.amount)}</b>
                        )}{' '}
                        {ingredient.unit && unitRecord[ingredient.unit].name}{' '}
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
                    </Box>
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
        </Grid2>
      </Grid2>
      <RecipeMoreMenu
        recipeId={recipe.id}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
        onDelete={() => {
          void navigate({ to: '/recipes' });
        }}
      />
    </Box>
  );
}
