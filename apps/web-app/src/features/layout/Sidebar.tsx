import { CarrotIcon } from '#src/components/CarrotIcon';
import { ListItemButtonLink } from '#src/components/ListItemButtonLink';
import { RouterButton } from '#src/components/RouterButton';
import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useClerk } from '@clerk/tanstack-start';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {
  alpha,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem as MuiListItem,
  Typography,
} from '@mui/material';
import {
  useAddRecipeToRecipeBook,
  useRecipeBooks,
} from '@open-zero/features/recipes-books';
import { useSignedInUser } from '@open-zero/features/users';
import { useRouterState, type LinkProps } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

const drawerWidth = 240;

interface Props {
  isSmallScreen?: boolean;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose, isSmallScreen }: Props) {
  const { data: user } = useSignedInUser();
  const userId = useSignedInUserId();
  const { data: recipeBooks } = useRecipeBooks({
    options: { userId: userId },
  });
  const addRecipeToRecipeBook = useAddRecipeToRecipeBook();
  const { openUserProfile } = useClerk();

  useEffect(() => {
    return monitorForElements({
      onDrop(dropResult) {
        const source = dropResult.source;
        const sourceType = source.data['type'] as string | undefined;

        const target = dropResult.location.current.dropTargets[0];

        if (!target) {
          return;
        }

        const targetType = target.data['type'] as string | undefined;

        if (sourceType === 'recipe' && targetType === 'recipe_book_sidebar') {
          console.log('DND: add recipe to recipe book');

          const sourceRecipeId = source.data['recipeId'] as string;
          const targetRecipeBookId = target.data['recipeBookId'] as string;

          addRecipeToRecipeBook.mutate({
            recipeId: sourceRecipeId,
            recipeBookId: targetRecipeBookId,
          });
        }
      },
      canMonitor: ({ source }) =>
        ['recipe', 'recipe_book_sidebar'].includes(
          source.data['type'] as string,
        ),
    });
  }, [addRecipeToRecipeBook]);

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
        <RouterButton
          to="/recipes/new"
          variant="contained"
          startIcon={<AddRoundedIcon />}
        >
          New
        </RouterButton>
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
            matchExact
          >
            {recipeBooks?.map((recipeBook) => (
              <DroppableRecipeBookListItem
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
                recipeBookId={recipeBook.id}
              />
            ))}
          </ListItem>
          {user?.accessRole === 'admin' && (
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
      <Box sx={{ pb: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <MuiListItem disablePadding>
          <ListItemButton
            onClick={() => {
              openUserProfile();
            }}
            sx={{
              mx: 1,
              borderRadius: 1,
              border: 2,
              borderColor: 'transparent',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '42px',
              }}
            >
              <PersonRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={'Account'}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: 16,
                  },
                },
              }}
            />
          </ListItemButton>
        </MuiListItem>
        <ListItem
          icon={<SettingsRoundedIcon />}
          label="Settings"
          onClick={onClose}
          linkProps={{
            to: '/settings',
          }}
          plainPath="/settings"
        />
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
  matchExact?: boolean;
  draggingOver?: boolean;
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
  matchExact,
  draggingOver,
  children,
}: ListItemProps) {
  const [open, setOpen] = useState(false);
  const router = useRouterState();
  const location = router.location;

  const selected = matchExact
    ? location.pathname === plainPath
    : location.pathname.startsWith(plainPath);

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
            border: 2,
            borderColor: (theme) =>
              draggingOver ? theme.palette.primary.main : 'transparent',
            backgroundColor: (theme) =>
              draggingOver ? alpha(theme.palette.primary.main, 0.2) : undefined,
            transitionProperty: 'border-color, background-color',
            transitionTimingFunction: 'cubic-bezier(0.15, 1.0, 0.3, 1.0)',
            transitionDuration: '350ms',
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

type DroppableRecipeBookListItemProps = ListItemProps & {
  recipeBookId: string;
};

function DroppableRecipeBookListItem({
  recipeBookId,
  ...rest
}: DroppableRecipeBookListItemProps) {
  const ref = useRef<null | HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    return dropTargetForElements({
      element: el,
      getData: () => ({
        type: 'recipe_book_sidebar',
        recipeBookId: recipeBookId,
      }),
      onDragEnter: () => {
        setIsDraggedOver(true);
      },
      onDragLeave: () => {
        setIsDraggedOver(false);
      },
      onDrop: () => {
        setIsDraggedOver(false);
      },
      canDrop({ source }) {
        return source.data['type'] === 'recipe';
      },
    });
  }, [recipeBookId]);

  return (
    <div ref={ref}>
      <ListItem {...rest} draggingOver={isDraggedOver} />
    </div>
  );
}
