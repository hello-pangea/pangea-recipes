import { ButtonLink } from '#src/components/ButtonLink';
import { CarrotIcon } from '#src/components/CarrotIcon';
import { ListItemButtonLink } from '#src/components/ListItemButtonLink';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  ListItem as MuiListItem,
  Typography,
} from '@mui/material';
import { useRecipeBooks } from '@open-zero/features/recipes-books';
import { useRouterState, type LinkProps } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuthRequired } from '../auth/useAuth';

const drawerWidth = 240;

interface Props {
  isSmallScreen?: boolean;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose, isSmallScreen }: Props) {
  const { user } = useAuthRequired();
  const { data: recipeBooks } = useRecipeBooks({
    options: { userId: user.id },
  });

  const sidebarContent = (
    <>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
        <img src="/assets/lil-guy.svg" width={32} height={32} />
        <Typography
          variant="h1"
          sx={{
            fontSize: 18,
            lineHeight: 1,
            ml: 1.5,
            pt: '0.3rem',
          }}
        >
          Hello Recipes
        </Typography>
      </Box>
      <Box sx={{ p: 1 }}>
        <ButtonLink
          to="/recipes/new"
          variant="contained"
          startIcon={<AddRoundedIcon />}
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
            icon={<RestaurantMenuRoundedIcon />}
            label="Recipes"
            onClick={onClose}
            linkProps={{
              to: '/recipes',
            }}
            plainPath="/recipes"
          />
          <ListItem
            icon={<MenuBookRoundedIcon />}
            label="Recipe books"
            linkProps={{
              to: '/recipe-books',
            }}
            plainPath="/recipe-books"
          >
            {recipeBooks?.recipeBooks.map((recipeBook) => (
              <ListItem
                key={recipeBook.id}
                icon={<CircleRoundedIcon sx={{ fontSize: 14 }} />}
                label={recipeBook.name}
                isNested
                linkProps={{
                  to: '/recipe-books/$recipeBookId',
                  params: {
                    recipeBookId: recipeBook.id,
                  },
                }}
                plainPath={`/recipe-books/${recipeBook.id}`}
              />
            ))}
          </ListItem>
          {user.accessRole === 'admin' && (
            <ListItem
              icon={<CarrotIcon />}
              label="Canonical ingredients"
              onClick={onClose}
              linkProps={{
                to: '/canonical-ingredients',
              }}
              plainPath="/canonical-ingredients"
            />
          )}
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
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  linkProps: LinkProps;
  small?: boolean;
  isNested?: boolean;
  plainPath: string;
  children?: React.ReactNode;
}

function ListItem({
  icon,
  label,
  linkProps,
  onClick,
  small,
  isNested,
  plainPath,
  children,
}: ListItemProps) {
  const [open, setOpen] = useState(false);
  const router = useRouterState();
  const location = router.location;

  const selected = location.pathname === plainPath;

  return (
    <>
      <MuiListItem
        disablePadding
        secondaryAction={
          children && (
            <IconButton
              edge="end"
              onClick={() => {
                setOpen(!open);
              }}
              size="small"
            >
              {open ? <ExpandMoreRoundedIcon /> : <ChevronRightRoundedIcon />}
            </IconButton>
          )
        }
      >
        <ListItemButtonLink
          onClick={onClick}
          selected={selected}
          sx={{
            mx: 1,
            borderRadius: 1,
            pl: isNested ? 4 : undefined,
            py: small ? 0.5 : undefined,
          }}
          to={linkProps.to}
          params={linkProps.params}
        >
          {icon && (
            <ListItemIcon
              sx={{
                color: (theme) =>
                  selected ? theme.palette.primary.main : undefined,
                minWidth: small ? '28px' : '42px',
              }}
            >
              {icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={label}
            slotProps={{
              primary: {
                sx: {
                  fontWeight: selected ? 'bold' : 'normal',
                  color: (theme) =>
                    selected ? theme.palette.primary.main : undefined,
                  fontSize: small ? 14 : 16,
                },
              },
            }}
          />
        </ListItemButtonLink>
      </MuiListItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}
