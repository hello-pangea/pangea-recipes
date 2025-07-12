import { useIsMounted } from '#src/hooks/useIsMounted';
import { useWakeLock } from '#src/hooks/useWakeLock';
import { getNumberFromInput } from '#src/utils/getNumberFromInput';
import { secondsToTimeString } from '#src/utils/timeFormatting';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BlenderRoundedIcon from '@mui/icons-material/BlenderRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Link,
  Popover,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { stepDownSnapped, stepUpSnapped } from '@open-zero/features';
import { getRecipeQueryOptions } from '@open-zero/features/recipes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Ingredient } from './Ingredient';
import { Nutrition } from './Nutrition';
import { RecipeMoreMenu } from './RecipeMoreMenu';
import { RecipeTags } from './RecipeTags';

interface Props {
  recipeId: string;
  readOnly?: boolean;
}

export function Recipe({ readOnly, recipeId }: Props) {
  const { data: recipe } = useSuspenseQuery(getRecipeQueryOptions(recipeId));
  const navigate = useNavigate();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const { enqueueSnackbar } = useSnackbar();
  const {
    isSupported: isWakeLockSupported,
    released: isWakeLockReleased,
    request: requestWakeLock,
    release: releaseWakeLock,
  } = useWakeLock({
    reacquireOnPageVisible: true,
    onError: () => {
      enqueueSnackbar('Failed to keep screen awake', { variant: 'error' });
    },
  });
  const isMounted = useIsMounted();
  const [servingsModifier, setServingsModifier] = useState(
    String(recipe.servings ?? 1),
  );
  const [servingsAnchorEl, setServingsAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const servingsMultiplier = recipe.servings
    ? (getNumberFromInput(servingsModifier) ?? 1) / recipe.servings
    : (getNumberFromInput(servingsModifier) ?? 1);
  const isPhone = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const coverImageUrl = recipe.images?.at(0)?.url;

  return (
    <>
      <Stack
        spacing={4}
        sx={{
          mb: 4,
        }}
      >
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
                    color: (theme) => theme.vars.palette.text.secondary,
                  }}
                >
                  {recipe.websiteSource.title}
                </Link>
              )}
            </Box>
            {!readOnly && (
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
            )}
          </Box>
          <RecipeTags
            recipeId={recipe.id}
            readOnly={readOnly}
            sx={{
              mb: 2,
            }}
          />
          <Typography sx={{ maxWidth: 500, mb: { xs: 2, sm: 4 } }}>
            {recipe.description}
          </Typography>
          <Grid container spacing={2} columns={{ xs: 2, sm: 3 }}>
            <Grid size={1}>
              <Stack spacing={1} alignItems={'flex-start'}>
                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  sx={{ height: 30 }}
                >
                  <GroupsRoundedIcon fontSize="small" />
                  <Typography variant="h3">Servings</Typography>
                  <Button
                    size="small"
                    onClick={(event) => {
                      setServingsAnchorEl(event.currentTarget);
                    }}
                    aria-describedby="servings-popover"
                    sx={{
                      minWidth: { xs: 32, sm: 48 },
                    }}
                  >
                    {isPhone ? '+/-' : 'Scale'}
                  </Button>
                </Stack>
                <Typography>
                  {recipe.servings === null ? (
                    servingsMultiplier === 1 ? (
                      '--'
                    ) : (
                      <b>({servingsMultiplier}x)</b>
                    )
                  ) : (
                    <>
                      {recipe.servings * servingsMultiplier}
                      {servingsMultiplier !== 1 ? (
                        <b> ({Number(servingsMultiplier.toFixed(3))}x)</b>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                </Typography>
                <Popover
                  id="servings-popover"
                  open={Boolean(servingsAnchorEl)}
                  anchorEl={servingsAnchorEl}
                  onClose={() => {
                    setServingsAnchorEl(null);
                  }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        p: 1,
                        mt: '-4px',
                      },
                    },
                  }}
                >
                  <Stack spacing={1} direction={'row'} alignItems={'center'}>
                    <TextField
                      size="small"
                      value={servingsModifier}
                      onChange={(event) => {
                        setServingsModifier(event.target.value);
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        const value = getNumberFromInput(servingsModifier);

                        if (value !== null && !isNaN(value)) {
                          setServingsModifier(
                            stepDownSnapped({
                              value: value,
                              steps: [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2],
                              stepDownBy: 1,
                            }).toString(),
                          );
                        }
                      }}
                    >
                      <RemoveRoundedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        const value = getNumberFromInput(servingsModifier);

                        if (value !== null && !isNaN(value)) {
                          setServingsModifier(
                            stepUpSnapped({
                              value: value,
                              steps: [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2],
                              stepUpBy: 1,
                            }).toString(),
                          );
                        }
                      }}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  </Stack>
                </Popover>
              </Stack>
            </Grid>
            {recipe.prepTime !== null && (
              <Grid size={1}>
                <Stack spacing={1}>
                  <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{ height: 30 }}
                  >
                    <BlenderRoundedIcon fontSize="small" />
                    <Typography variant="h3">Prep Time</Typography>
                  </Stack>
                  <Typography>
                    {secondsToTimeString(recipe.prepTime)}
                  </Typography>
                </Stack>
              </Grid>
            )}
            {recipe.cookTime !== null && (
              <Grid size={1}>
                <Stack spacing={1}>
                  <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{ height: 30 }}
                  >
                    <LocalFireDepartmentRoundedIcon fontSize="small" />
                    <Typography variant="h3">Cook Time</Typography>
                  </Stack>
                  <Typography>
                    {secondsToTimeString(recipe.cookTime)}
                  </Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Card>
        {coverImageUrl && (
          <Box
            sx={{
              borderRadius: 2,
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              boxShadow:
                '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            <img
              src={coverImageUrl}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </Box>
        )}
      </Stack>
      {/* SSR fix */}
      {isWakeLockSupported && isMounted && (
        <FormGroup sx={{ mb: 2 }}>
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
      <Grid container spacing={4}>
        <Grid
          size={{
            sm: 12,
            md: 6,
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
                    <Ingredient
                      ingredient={ingredient}
                      key={ingredient.id}
                      multiplier={servingsMultiplier}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid>
        <Grid
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
                            color: (theme) => theme.vars.palette.text.heading,
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
        </Grid>
      </Grid>
      {recipe.nutrition && (
        <Nutrition
          nutrition={recipe.nutrition}
          sx={{ mt: 6 }}
          showApproximateWarning={Boolean(recipe.websiteSource)}
        />
      )}
      {!readOnly && (
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
      )}
    </>
  );
}
