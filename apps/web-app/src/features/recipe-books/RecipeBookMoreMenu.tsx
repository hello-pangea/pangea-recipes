import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  useDeleteRecipeBook,
  useRecipeBook,
} from '@open-zero/features/recipes-books';
import { Link } from '@tanstack/react-router';

interface Props {
  recipeBookId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDelete?: () => void;
}

export function RecipeBookMoreMenu({
  recipeBookId,
  anchorEl,
  onClose,
  onDelete,
}: Props) {
  const { data: recipeBook } = useRecipeBook({ recipeBookId: recipeBookId });
  const deleteRecipeBook = useDeleteRecipeBook();
  const open = Boolean(anchorEl);

  if (!recipeBook) {
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
          to="/recipe-books/$recipeBookId/edit"
          params={{ recipeBookId: recipeBook.id }}
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
      <MenuItem
        onClick={() => {
          deleteRecipeBook.mutate({ recipeBookId: recipeBook.id });

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
