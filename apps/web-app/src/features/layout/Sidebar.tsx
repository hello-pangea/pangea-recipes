import { ButtonLink } from '#src/components/ButtonLink';
import { CarrotIcon } from '#src/components/CarrotIcon';
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
import { useAuthRequired } from '../auth/useAuth';

const drawerWidth = 240;

interface Props {
  isSmallScreen?: boolean;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose, isSmallScreen }: Props) {
  const { user } = useAuthRequired();

  const sidebarContent = (
    <>
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
            onClick={onClose}
          />
          {user.accessRole === 'admin' && (
            <ListItem
              to="/canonical-ingredients"
              icon={<CarrotIcon />}
              label="Canonical ingredients"
              onClick={onClose}
            />
          )}
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
          onClick={onClose}
        >
          Account
        </ButtonLink>
      </Box>
    </>
  );

  if (isSmallScreen) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        width: drawerWidth,
      }}
    >
      {sidebarContent}
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
        slotProps={{
          primary: {
            sx: {
              fontWeight: selected ? 'bold' : 'normal',
              color: (theme) =>
                selected ? theme.palette.primary.main : undefined,
            },
          },
        }}
      />
    </ListItemButtonLink>
  );
}
