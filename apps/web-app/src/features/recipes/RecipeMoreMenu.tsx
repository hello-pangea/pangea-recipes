import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import {
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useDeleteRecipe, useRecipe } from '@open-zero/features/recipes';
import { Link } from '@tanstack/react-router';

interface Props {
  recipeId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDelete?: () => void;
  onRemoveFromRecipeBook?: () => void;
}

export function RecipeMoreMenu({
  recipeId,
  anchorEl,
  onClose,
  onDelete,
  onRemoveFromRecipeBook,
}: Props) {
  const recipeQuery = useRecipe({ recipeId: recipeId });
  const recipe = recipeQuery.data?.recipe;
  const deleteRecipe = useDeleteRecipe();
  const open = Boolean(anchorEl);

  if (!recipe) {
    return <CircularProgress />;
  }

  return (
    <Menu
      id="more-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'more-button',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuItem sx={{ p: 0 }}>
        <Link
          to="/app/recipes/$recipeId/edit"
          params={{ recipeId: recipe.id }}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </Link>
      </MenuItem>
      <Divider />
      {onRemoveFromRecipeBook && (
        <MenuItem
          onClick={() => {
            onRemoveFromRecipeBook();

            onClose();
          }}
        >
          <ListItemIcon>
            <RemoveCircleRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Remove from recipe book</ListItemText>
        </MenuItem>
      )}
      {onRemoveFromRecipeBook && <Divider />}
      <MenuItem
        onClick={() => {
          deleteRecipe.mutate({ recipeId: recipe.id });

          if (onDelete) {
            onDelete();
          }

          onClose();
        }}
      >
        <ListItemIcon>
          <DeleteRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}
