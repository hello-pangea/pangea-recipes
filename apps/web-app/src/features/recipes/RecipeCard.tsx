import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  CardActionArea,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useRecipe } from '@open-zero/features';
import { useState } from 'react';
import { RecipeMoreMenu } from './RecipeMoreMenu';

interface Props {
  recipeId: string;
}

export function RecipeCard({ recipeId }: Props) {
  const recipeQuery = useRecipe({ recipeId: recipeId ?? '' });
  const recipe = recipeQuery.data?.recipe;
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  if (!recipe) {
    return <CircularProgress />;
  }

  return (
    <>
      <Card variant="outlined">
        <CardActionArea href={`/recipes/${recipe.id}`}>
          <img
            src={
              'https://rainbowplantlife.com/wp-content/uploads/2021/06/tofu-scramble-on-table-square-1-of-1.jpg'
            }
            height={200}
            width={'100%'}
            style={{ objectFit: 'cover', display: 'block' }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
            }}
          >
            <Typography variant="body1">{recipe.name}</Typography>
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
        </CardActionArea>
      </Card>
      <RecipeMoreMenu
        recipeId={recipeId}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
      />
    </>
  );
}
