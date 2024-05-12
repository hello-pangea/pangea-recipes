import { LoadingPage } from '#src/components/LoadingPage';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { numberToFraction, useRecipe, useUnits } from '@open-zero/features';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RecipeMoreMenu } from './RecipeMoreMenu';

export function RecipePage() {
  const navigate = useNavigate();
  const { recipeId } = useParams<{ recipeId: string }>();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const recipeQuery = useRecipe({
    recipeId: recipeId ?? '',
  });
  const unitsQuery = useUnits();

  if (!recipeQuery.data) {
    return <LoadingPage message="Loading recipe" />;
  }

  const recipe = recipeQuery.data.recipe;

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
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
              <Link
                href="https://rainbowplantlife.com/eggy-tofu-scramble/"
                target="_blank"
                rel="nofollow"
              >
                Original source
              </Link>
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
          <Stack direction={'row'} spacing={1} sx={{ mb: 1 }}>
            {['Breakfast', 'Vegan'].map((tag) => (
              <Box
                key={tag}
                sx={{
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                }}
              >
                <Typography variant="body2">{tag}</Typography>
              </Box>
            ))}
          </Stack>
          <Typography>{recipe.description}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              boxShadow:
                'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
              borderRadius: 1,
            }}
          >
            <img
              src={
                'https://rainbowplantlife.com/wp-content/uploads/2021/06/tofu-scramble-on-table-square-1-of-1.jpg'
              }
              height={300}
              width={'100%'}
              style={{
                objectFit: 'cover',
                display: 'block',
                borderRadius: 8,
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Ingredients
      </Typography>
      <Box component="ul" sx={{ mb: 4 }}>
        {recipe.ingredients.map((ingredient) => (
          <Box component={'li'} key={ingredient.id}>
            <Checkbox
              size="small"
              sx={{ p: 0.75, mr: 0.5, '& .MuiSvgIcon-root': { fontSize: 18 } }}
            />
            {ingredient.amount !== null && (
              <b>{numberToFraction(ingredient.amount)}</b>
            )}{' '}
            {
              unitsQuery.data?.units.find((u) => u.id === ingredient.unitId)
                ?.name
            }{' '}
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
                {ingredient.notes}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Instructions
      </Typography>
      <Stack component={'ol'} spacing={2} sx={{ maxWidth: '500px' }}>
        {recipe.instructions.map((instruction, index) => (
          <Box component={'li'} key={instruction.id} sx={{ display: 'flex' }}>
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
      <RecipeMoreMenu
        recipeId={recipe.id}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
        onDelete={() => {
          navigate('/recipes');
        }}
      />
    </Box>
  );
}
