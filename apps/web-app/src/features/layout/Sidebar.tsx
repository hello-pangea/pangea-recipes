import { ButtonLink } from '#src/components/ButtonLink';
import { ListItemButtonLink } from '#src/components/ListItemButtonLink';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useRouterState, type LinkProps } from '@tanstack/react-router';

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
        <Typography
          variant="h1"
          sx={{ fontSize: 22, lineHeight: 1, ml: 2, pt: '0.4rem' }}
        >
          Hello Recipes
        </Typography>
      </Box>
      <Box sx={{ p: 1 }}>
        <ButtonLink
          to="/recipes/new"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          fullWidth
        >
          New
        </ButtonLink>
      </Box>
      {/* Navigation */}
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <List>
          <ListItem
            to="/recipes"
            icon={<RestaurantMenuRoundedIcon />}
            label="Recipes"
          />
          {/* <Tooltip title="Coming soon" arrow placement="right">
            <span>
              <ListItem
                to="/recipe-books"
                icon={<MenuBookRoundedIcon />}
                label="Recipe books"
              />
            </span>
          </Tooltip> */}
        </List>
      </Box>
      <Divider />
      <Box sx={{ px: 2, py: 1 }}>
        <ButtonLink
          to="/account"
          variant="text"
          startIcon={<PersonRoundedIcon />}
          fullWidth
        >
          Account
        </ButtonLink>
      </Box>
    </Drawer>
  );
}

interface ListItemProps {
  to?: LinkProps['to'];
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function ListItem({ icon, label, to, onClick }: ListItemProps) {
  const router = useRouterState();
  const location = router.location;

  const selected = location.pathname.startsWith(to ?? '');

  return (
    <ListItemButtonLink
      to={to ?? ''}
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
    </ListItemButtonLink>
  );
}
