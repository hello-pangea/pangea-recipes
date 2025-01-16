import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  CardActionArea,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import {
  useDeleteCanonicalIngredient,
  type CanonicalIngredient,
} from '@open-zero/features/canonical-ingredients';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

interface Props {
  canonicalIngredient: CanonicalIngredient;
}

export function CanonicalIngredientCell({ canonicalIngredient }: Props) {
  const deleteCanonicalIngredient = useDeleteCanonicalIngredient();
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
        <Stack direction="row" alignItems="center" spacing={1}>
          {canonicalIngredient.icon && (
            <img
              src={canonicalIngredient.icon.url}
              alt={canonicalIngredient.name}
              style={{
                width: 20,
                height: 20,
                marginRight: 1,
              }}
            />
          )}
          <Typography variant="body1">{canonicalIngredient.name}</Typography>
        </Stack>
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
        <Link
          to="/app/canonical-ingredients/$canonicalIngredientId/edit"
          params={{ canonicalIngredientId: canonicalIngredient.id }}
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
            deleteCanonicalIngredient.mutate({
              canonicalIngredientId: canonicalIngredient.id,
            });

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
