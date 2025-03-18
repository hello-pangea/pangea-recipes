import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
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
} from '@mui/material';
import {
  useAddRecipeToRecipeBook,
  useCreateRecipeBook,
  useRecipeBooks,
} from '@open-zero/features/recipe-books';
import { useDeleteRecipe, useRecipe } from '@open-zero/features/recipes';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

interface Props {
  recipeId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDelete?: () => void;
  onRemoveFromRecipeBook?: () => void;
}

export function RecipeMoreMenu({
  recipeId,
  anchorEl,
  onClose,
  onDelete,
  onRemoveFromRecipeBook,
}: Props) {
  const userId = useSignedInUserId();
  const { data: recipe } = useRecipe({ recipeId: recipeId });
  const { data: recipeBooks } = useRecipeBooks({
    options: {
      userId,
    },
  });
  const deleteRecipe = useDeleteRecipe();
  const createRecipeBook = useCreateRecipeBook();
  const addRecipeToRecipeBook = useAddRecipeToRecipeBook();
  const open = Boolean(anchorEl);

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
        <MenuItem
          onMouseEnter={(event) => {
            setBooksAnchorEl(event.currentTarget);
          }}
          sx={{
            backgroundColor: (theme) =>
              booksOpen ? theme.palette.action.hover : 'transparent',
          }}
        >
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add to recipe book</ListItemText>
          <ListItemIcon
            sx={{
              justifyContent: 'flex-end',
            }}
          >
            <ChevronRightRoundedIcon fontSize="small" />
          </ListItemIcon>
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
            <ListItemText>Remove from recipe book</ListItemText>
          </MenuItem>
        )}
        {onRemoveFromRecipeBook && <Divider />}
        <MenuItem
          onClick={() => {
            deleteRecipe.mutate({ recipeId: recipe.id });

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
            placeholder="Find a recipe book"
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
                  recipeBookId: firstRecipeBook.id,
                  recipeId: recipe.id,
                });

                handleClose();
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ color: (theme) => theme.palette.text.disabled }}
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
              { name: recipe.name },
              {
                onSuccess: (newRecipeBook) => {
                  addRecipeToRecipeBook.mutate({
                    recipeBookId: newRecipeBook.id,
                    recipeId: recipe.id,
                  });
                },
              },
            );
          }}
        >
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New recipe book</ListItemText>
        </MenuItem>
        <Divider />
        {filteredRecipeBooks.map((book) => (
          <MenuItem
            key={book.id}
            onClick={() => {
              addRecipeToRecipeBook.mutate({
                recipeBookId: book.id,
                recipeId: recipe.id,
              });

              handleClose();
            }}
          >
            <ListItemText>{book.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
