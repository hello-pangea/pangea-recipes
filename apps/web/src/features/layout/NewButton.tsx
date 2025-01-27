import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

interface Props {
  onOptionClicked?: () => void;
}

export function NewButton({ onOptionClicked }: Props) {
  const [newMenuAnchorEl, setNewMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={(event) => {
          setNewMenuAnchorEl(event.currentTarget);
        }}
      >
        New
      </Button>
      <Menu
        anchorEl={newMenuAnchorEl}
        open={Boolean(newMenuAnchorEl)}
        onClose={() => {
          setNewMenuAnchorEl(null);
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
            to="/app/recipes/new"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
            onClick={() => {
              setNewMenuAnchorEl(null);

              if (onOptionClicked) {
                onOptionClicked();
              }
            }}
          >
            <ListItemIcon>
              <RestaurantMenuRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Recipe</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem sx={{ p: 0 }}>
          <Link
            to="/app/recipes/new"
            search={{
              importFromUrl: true,
            }}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
            onClick={() => {
              setNewMenuAnchorEl(null);

              if (onOptionClicked) {
                onOptionClicked();
              }
            }}
          >
            <ListItemIcon>
              <LinkRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Recipe from url</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem sx={{ p: 0 }}>
          <Link
            to="/app/recipe-books/new"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
            onClick={() => {
              setNewMenuAnchorEl(null);

              if (onOptionClicked) {
                onOptionClicked();
              }
            }}
          >
            <ListItemIcon>
              <MenuBookRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Recipe book</ListItemText>
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
}
