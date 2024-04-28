import { CarrotIcon } from '#src/components/CarrotIcon';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar() {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        height: '100vh',
        borderRight: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
        <img src="/assets/lil-guy.svg" width={24} height={24} />
        <Box sx={{ ml: 1 }}>
          <Typography variant="h1" sx={{ fontSize: 22, lineHeight: 1 }}>
            Hello Recipes
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            By Open Zero
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1 }}>
        <Button
          href="/new-recipe"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          fullWidth
        >
          New
        </Button>
      </Box>
      {/* Navigation */}
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <List>
          <ListItem
            path="/recipes"
            icon={<RestaurantMenuRoundedIcon />}
            label="Recipes"
          />
          <ListItem
            path="/ingredients"
            icon={<CarrotIcon />}
            label="Ingredients"
          />
          <Tooltip title="Coming soon" arrow placement="right">
            <span>
              <ListItem
                path="/recipe-books"
                icon={<MenuBookRoundedIcon />}
                label="Recipe books"
              />
            </span>
          </Tooltip>
        </List>
      </Box>
      <Divider />
      <Box sx={{ px: 2, py: 1 }}>
        <Button
          href="/account"
          variant="text"
          startIcon={<PersonRoundedIcon />}
          fullWidth
        >
          Account
        </Button>
      </Box>
    </Drawer>
  );
}

interface ListItemProps {
  path?: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function ListItem({ icon, label, path, onClick }: ListItemProps) {
  const location = useLocation();

  const selected = location.pathname.startsWith(path ?? '');

  return (
    <ListItemButton
      href={path ?? ''}
      onClick={onClick}
      selected={selected}
      sx={{
        mx: 1,
        borderRadius: 1,
      }}
    >
      <ListItemIcon
        sx={{
          color: (theme) => (selected ? theme.palette.primary.main : undefined),
          minWidth: '42px',
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          sx: {
            fontWeight: selected ? 'bold' : 'normal',
            color: (theme) =>
              selected ? theme.palette.primary.main : undefined,
          },
        }}
      />
    </ListItemButton>
  );
}
