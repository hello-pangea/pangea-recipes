import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useRecipe } from '@repo/features/recipes';

interface Props {
  recipeId: string;
  onRemove: () => void;
}

export function RequiredRecipeCard({ recipeId, onRemove }: Props) {
  const { data: recipe } = useRecipe({
    recipeId: recipeId,
  });

  if (!recipe) {
    return <CircularProgress />;
  }

  return (
    <Card variant="outlined">
      <img
        src={
          'https://www.foodandwine.com/thmb/tAS-x_IC4ss1cb9EdDpsr0UExdM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/bucatini-with-mushroom-ragu-dandelion-greens-and-tarragon-FT-RECIPE0421-3a5f0d29f7264f5e9952d4a3a51f5f58.jpg'
        }
        height={100}
        width={'100%'}
        style={{ objectFit: 'cover', display: 'block' }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 0.5,
        }}
      >
        <Typography variant="body1">{recipe.name}</Typography>
        <IconButton onClick={onRemove} color="error" size="small">
          <RemoveRoundedIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
