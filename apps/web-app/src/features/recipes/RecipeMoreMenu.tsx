import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useDeleteRecipe, useRecipe } from '@open-zero/features';
import { Link } from '@tanstack/react-router';

interface Props {
  recipeId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDelete?: () => void;
}

export function RecipeMoreMenu({
  recipeId,
  anchorEl,
  onClose,
  onDelete,
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
      <Link
        to="/recipes/$recipeId/edit"
        params={{ recipeId: recipe.id }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <MenuItem>
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
      </Link>
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
          <DeleteRoundedIcon color="error" fontSize="small" />
        </ListItemIcon>
        <ListItemText sx={{ color: (theme) => theme.palette.error.main }}>
          Delete
        </ListItemText>
      </MenuItem>
    </Menu>
  );
}
