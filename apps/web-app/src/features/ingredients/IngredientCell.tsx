import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  CardActionArea,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useDeleteIngredient, type Ingredient } from '@open-zero/features';
import { useState } from 'react';

interface Props {
  ingredient: Ingredient;
}

export function IngredientCell({ ingredient }: Props) {
  const deleteIngredient = useDeleteIngredient();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  function handleMoreMenuClose() {
    setMoreMenuAnchorEl(null);
  }

  return (
    <>
      <CardActionArea
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="body1">
          {ingredient.pluralName || ingredient.name}
        </Typography>
        <IconButton
          id="more-button"
          aria-controls={moreMenuOpen ? 'more-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={moreMenuOpen ? 'true' : undefined}
          onClick={(event) => {
            event.stopPropagation();
            setMoreMenuAnchorEl(event.currentTarget);
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        >
          <MoreVertRoundedIcon />
        </IconButton>
      </CardActionArea>
      <Menu
        id="more-menu"
        anchorEl={moreMenuAnchorEl}
        open={moreMenuOpen}
        onClose={handleMoreMenuClose}
        MenuListProps={{
          'aria-labelledby': 'more-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            deleteIngredient.mutate({ ingredientId: ingredient.id });

            handleMoreMenuClose();
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
    </>
  );
}
