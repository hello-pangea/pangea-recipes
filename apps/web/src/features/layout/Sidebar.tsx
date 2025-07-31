import { CarrotIcon } from '#src/components/CarrotIcon';
import { RouterLink } from '#src/components/RouterLink';
import { RouterListItemButton } from '#src/components/RouterListItemButton';
import type {
  DropTargetArgs,
  ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import UpcomingRoundedIcon from '@mui/icons-material/UpcomingRounded';
import {
  alpha,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  ListItem as MuiListItem,
  Typography,
} from '@mui/material';
import {
  useAddRecipeToRecipeBook,
  useRecipeBooks,
} from '@open-zero/features/recipe-books';
import { useUpdateRecipe } from '@open-zero/features/recipes';
import { useSignedInUser } from '@open-zero/features/users';
import { useRouterState, type LinkProps } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { NewButton } from './NewButton';

const drawerWidth = 240;

interface Props {
  isSmallScreen?: boolean;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose, isSmallScreen }: Props) {
  const { data: user } = useSignedInUser();
  const userId = useSignedInUserId();
  const { data: recipeBooks } = useRecipeBooks({
    options: { userId: userId },
  });
  const addRecipeToRecipeBook = useAddRecipeToRecipeBook();
  const updateRecipe = useUpdateRecipe();

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
            params: { id: targetRecipeBookId },
            body: {
              recipeId: sourceRecipeId,
            },
          });
        } else if (
          sourceType === 'recipe' &&
          targetType === 'recipes_sidebar'
        ) {
          const sourceRecipeId = source.data['recipeId'] as string;

          updateRecipe.mutate({
            params: { id: sourceRecipeId },
            body: {
              tryLater: false,
            },
          });
        } else if (
          sourceType === 'recipe' &&
          targetType === 'try_later_sidebar'
        ) {
          const sourceRecipeId = source.data['recipeId'] as string;

          updateRecipe.mutate({
            params: { id: sourceRecipeId },
            body: {
              tryLater: true,
            },
          });
        } else if (
          sourceType === 'recipe' &&
          targetType === 'favorites_sidebar'
        ) {
          const sourceRecipeId = source.data['recipeId'] as string;

          updateRecipe.mutate({
            params: { id: sourceRecipeId },
            body: {
              favorite: true,
            },
          });
        }
      },
      canMonitor: ({ source }) =>
        ['recipe', 'recipe_book_sidebar'].includes(
          source.data['type'] as string,
        ),
    });
  }, [addRecipeToRecipeBook, updateRecipe]);

  const sidebarContent = (
    <>
      {/* Header */}
      <RouterLink
        to="/app/recipes"
        sx={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
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
      </RouterLink>
      <Box sx={{ p: 1 }}>
        <NewButton
          onOptionClick={() => {
            onClose();
          }}
        />
      </Box>
      {/* Navigation */}
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <List>
          <DroppableListItem
            icon={<RestaurantMenuRoundedIcon />}
            label="My recipes"
            onClick={onClose}
            linkProps={{
              to: '/app/recipes',
            }}
            plainPath="/app/recipes"
            data={{
              type: 'recipes_sidebar',
            }}
            canDrop={({ source }) => {
              return (
                source.data['type'] === 'recipe' &&
                Boolean(source.data['tryLater'])
              );
            }}
          />
          <DroppableListItem
            icon={<FavoriteRoundedIcon />}
            label="Favorites"
            onClick={onClose}
            linkProps={{
              to: '/app/favorites',
            }}
            plainPath="/app/favorites"
            data={{
              type: 'favorites_sidebar',
            }}
            canDrop={({ source }) => {
              return (
                source.data['type'] === 'recipe' && !source.data['favorite']
              );
            }}
          />
          <DroppableListItem
            icon={<UpcomingRoundedIcon />}
            label="Try later"
            onClick={onClose}
            linkProps={{
              to: '/app/try-later',
            }}
            plainPath="/app/try-later"
            data={{
              type: 'try_later_sidebar',
            }}
            canDrop={({ source }) => {
              return (
                source.data['type'] === 'recipe' && !source.data['tryLater']
              );
            }}
          />
          <ListItem
            icon={<MenuBookRoundedIcon />}
            label="Books"
            onClick={onClose}
            linkProps={{
              to: '/app/recipe-books',
            }}
            plainPath="/app/recipe-books"
            matchExact
          >
            {(recipeBooks?.length ?? 0) > 0
              ? recipeBooks?.map((recipeBook) => (
                  <DroppableRecipeBookListItem
                    key={recipeBook.id}
                    label={recipeBook.name}
                    onClick={onClose}
                    isNested
                    linkProps={{
                      to: '/app/recipe-books/$recipeBookId',
                      params: {
                        recipeBookId: recipeBook.id,
                      },
                    }}
                    plainPath={`/app/recipe-books/${recipeBook.id}`}
                    recipeBookId={recipeBook.id}
                  />
                ))
              : undefined}
          </ListItem>
          {user?.accessRole === 'admin' && (
            <ListItem
              icon={<CarrotIcon />}
              label="Canonical ingredients"
              onClick={onClose}
              linkProps={{
                to: '/app/canonical-ingredients',
              }}
              plainPath="/app/canonical-ingredients"
            />
          )}
        </List>
      </Box>
      <Box sx={{ pb: 1 }}>
        <ListItem
          icon={<SettingsRoundedIcon />}
          label="Settings"
          onClick={onClose}
          linkProps={{
            to: '/app/settings',
          }}
          plainPath="/app/settings"
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
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          backgroundColor: 'transparent',
          borderRight: 0,
        },
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
  const [open, setOpen] = useState(true);
  const router = useRouterState();
  const location = router.location;

  const selected = matchExact
    ? location.pathname === plainPath
    : location.pathname === plainPath ||
      location.pathname.startsWith(plainPath + '/');

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
        sx={{
          pl: isNested ? 2 : 0,
        }}
      >
        <RouterListItemButton
          onClick={onClick}
          selected={selected}
          sx={{
            mx: 1,
            borderRadius: 1,
            py: small ? 0.5 : undefined,
            border: 2,
            borderColor: (theme) =>
              draggingOver ? theme.vars.palette.primary.main : 'transparent',
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
                  selected ? theme.vars.palette.primary.main : undefined,
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
                  color: (theme) =>
                    selected ? theme.vars.palette.primary.main : undefined,
                  fontSize: small ? 14 : 16,
                },
              },
            }}
          />
        </RouterListItemButton>
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

type DroppableListItemProps = ListItemProps & {
  data: Record<string | symbol, unknown>;
  canDrop?: DropTargetArgs<ElementDragType>['canDrop'];
};

function DroppableListItem({ data, canDrop, ...rest }: DroppableListItemProps) {
  const ref = useRef<null | HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    return dropTargetForElements({
      element: el,
      getData: () => data,
      onDragEnter: () => {
        setIsDraggedOver(true);
      },
      onDragLeave: () => {
        setIsDraggedOver(false);
      },
      onDrop: () => {
        setIsDraggedOver(false);
      },
      canDrop: canDrop,
    });
  }, [data, canDrop]);

  return (
    <div ref={ref}>
      <ListItem {...rest} draggingOver={isDraggedOver} />
    </div>
  );
}
