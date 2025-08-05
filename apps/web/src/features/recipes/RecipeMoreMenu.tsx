import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import UpcomingRoundedIcon from '@mui/icons-material/UpcomingRounded';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  type MenuProps,
} from '@mui/material';
import {
  listRecipeBooksQueryOptions,
  useAddRecipeToRecipeBook,
  useCreateRecipeBook,
} from '@repo/features/recipe-books';
import {
  getRecipeQueryOptions,
  useDeleteRecipe,
  useUpdateRecipe,
} from '@repo/features/recipes';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { RecipeBookMenuItem } from './RecipeBookMenuItem';

interface Props
  extends Pick<MenuProps, 'anchorEl' | 'anchorReference' | 'anchorPosition'> {
  recipeId: string;
  onClose: () => void;
  onDelete?: () => void;
  onRemoveFromRecipeBook?: () => void;
}

export function RecipeMoreMenu({
  recipeId,
  anchorEl,
  anchorPosition,
  anchorReference,
  onClose,
  onDelete,
  onRemoveFromRecipeBook,
}: Props) {
  const userId = useSignedInUserId();
  const { data: recipe } = useQuery(getRecipeQueryOptions(recipeId));
  const { data: recipeBooks } = useQuery(
    listRecipeBooksQueryOptions({ userId }),
  );
  const deleteRecipe = useDeleteRecipe();
  const createRecipeBook = useCreateRecipeBook();
  const updateRecipe = useUpdateRecipe();
  const addRecipeToRecipeBook = useAddRecipeToRecipeBook();
  const open = Boolean(anchorEl || anchorPosition);

  const [booksAnchorEl, setBooksAnchorEl] = useState<null | HTMLElement>(null);
  const booksOpen = Boolean(booksAnchorEl);

  const [search, setsSearch] = useState('');

  const filteredRecipeBooks = useMemo(() => {
    if (!recipeBooks) {
      return [];
    }

    const sortedRecipeBooks = recipeBooks.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    if (!search) {
      return sortedRecipeBooks;
    }

    return sortedRecipeBooks.filter((book) =>
      book.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [recipeBooks, search]);

  function handleClose() {
    setBooksAnchorEl(null);
    onClose();
  }

  if (!recipe) {
    return <CircularProgress />;
  }

  return (
    <>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        anchorPosition={anchorPosition}
        anchorReference={anchorReference}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          list: {
            'aria-labelledby': 'more-button',
          },
        }}
      >
        <MenuItem
          sx={{ p: 0 }}
          onMouseEnter={() => {
            setBooksAnchorEl(null);
          }}
        >
          <Link
            to="/app/recipes/$recipeId/edit"
            params={{ recipeId: recipe.id }}
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
          onMouseEnter={(event) => {
            setBooksAnchorEl(event.currentTarget);
          }}
          sx={{
            backgroundColor: (theme) =>
              booksOpen ? theme.vars.palette.action.hover : 'transparent',
          }}
        >
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add to book</ListItemText>
          <ListItemIcon
            sx={{
              justifyContent: 'flex-end',
            }}
          >
            <ChevronRightRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          onMouseEnter={() => {
            setBooksAnchorEl(null);
          }}
          onClick={() => {
            updateRecipe.mutate({
              params: { id: recipe.id },
              body: { favorite: !recipe.favorite },
            });
          }}
        >
          <ListItemIcon>
            {recipe.favorite ? (
              <FavoriteRoundedIcon fontSize="small" />
            ) : (
              <FavoriteBorderRoundedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onMouseEnter={() => {
            setBooksAnchorEl(null);
          }}
          onClick={() => {
            updateRecipe.mutate({
              params: { id: recipe.id },
              body: {
                tryLater: !recipe.tryLater,
              },
            });
          }}
        >
          <ListItemIcon>
            <UpcomingRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {recipe.tryLater ? 'Remove from try later' : 'Add to try later'}
          </ListItemText>
        </MenuItem>
        <Divider />
        {onRemoveFromRecipeBook && (
          <MenuItem
            onClick={() => {
              onRemoveFromRecipeBook();

              handleClose();
            }}
            onMouseEnter={() => {
              setBooksAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <RemoveCircleRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove from book</ListItemText>
          </MenuItem>
        )}
        {onRemoveFromRecipeBook && <Divider />}
        <MenuItem
          onClick={() => {
            deleteRecipe.mutate({ params: { id: recipe.id } });

            if (onDelete) {
              onDelete();
            }

            handleClose();
          }}
          onMouseEnter={() => {
            setBooksAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={booksAnchorEl}
        open={booksOpen}
        onClose={() => {
          handleClose();
        }}
        disableRestoreFocus
        disableEnforceFocus
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          pointerEvents: 'none',
          '& .MuiList-root': {
            pointerEvents: 'auto',
          },
        }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 300,
            },
          },
        }}
      >
        <Box
          sx={{
            px: 1,
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Find a book"
            value={search}
            fullWidth
            onChange={(event) => {
              setsSearch(event.target.value);
            }}
            onKeyDown={(event) => {
              event.stopPropagation();

              if (event.key === 'Enter') {
                const firstRecipeBook = filteredRecipeBooks[0];

                if (!firstRecipeBook) {
                  return;
                }

                addRecipeToRecipeBook.mutate({
                  params: {
                    id: firstRecipeBook.id,
                  },
                  body: {
                    recipeId: recipe.id,
                  },
                });

                handleClose();
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{
                        color: (theme) => theme.vars.palette.text.disabled,
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      size="small"
                      onClick={() => {
                        setsSearch('');
                      }}
                    >
                      <ClearRoundedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  pr: 0.5,
                  pl: 1,
                  mb: 1,
                },
              },
            }}
          />
        </Box>
        <MenuItem
          onClick={() => {
            createRecipeBook.mutate(
              { body: { name: recipe.name } },
              {
                onSuccess: (newRecipeBook) => {
                  addRecipeToRecipeBook.mutate({
                    params: {
                      id: newRecipeBook.id,
                    },
                    body: {
                      recipeId: recipe.id,
                    },
                  });
                },
              },
            );
          }}
        >
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New book</ListItemText>
        </MenuItem>
        {filteredRecipeBooks.length > 0 && <Divider />}
        {filteredRecipeBooks.map((book) => (
          <RecipeBookMenuItem key={book.id} book={book} recipeId={recipe.id} />
        ))}
      </Menu>
    </>
  );
}
