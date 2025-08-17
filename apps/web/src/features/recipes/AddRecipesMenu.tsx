import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
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
import { listRecipesQueryOptions } from '@repo/features/recipes';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

interface Props extends Pick<MenuProps, 'anchorEl'> {
  addedRecipeIds: string[];
  onToggleRecipe: (recipeId: string) => void;
  onClose: () => void;
  onNewRecipe?: () => void;
}

export function AddRecipesMenu({
  anchorEl,
  addedRecipeIds,
  onToggleRecipe,
  onClose,
  onNewRecipe,
}: Props) {
  const userId = useSignedInUserId();
  const { data: recipes } = useQuery(listRecipesQueryOptions({ userId }));

  const [search, setsSearch] = useState('');

  const [initialAddedIds, setInitialAddedIds] = useState<string[]>([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Snapshot on open, reset on close
    if (open) {
      setInitialAddedIds(addedRecipeIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) {
      return [];
    }

    const sortedRecipes = recipes
      .filter((r) => !initialAddedIds.includes(r.id)) // hide initially-added recipes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (!search) {
      return sortedRecipes;
    }

    return sortedRecipes.filter((book) =>
      book.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [recipes, search, initialAddedIds]);

  function handleClose() {
    onClose();
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={() => {
        handleClose();
      }}
      disableRestoreFocus
      disableEnforceFocus
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
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
          placeholder="Find a recipe"
          value={search}
          autoFocus
          fullWidth
          onChange={(event) => {
            setsSearch(event.target.value);
          }}
          onKeyDown={(event) => {
            event.stopPropagation();

            if (event.key === 'Enter') {
              const firstRecipe = filteredRecipes[0];

              if (!firstRecipe) {
                return;
              }

              onToggleRecipe(firstRecipe.id);

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
      {onNewRecipe && (
        <MenuItem
          onClick={() => {
            onNewRecipe();
          }}
        >
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New recipe</ListItemText>
        </MenuItem>
      )}
      {filteredRecipes.length > 0 && <Divider />}
      {filteredRecipes.map((recipe) => {
        const isAdded = addedRecipeIds.includes(recipe.id);

        return (
          <MenuItem
            key={recipe.id}
            onClick={() => {
              onToggleRecipe(recipe.id);
            }}
          >
            <AnimatePresence initial={false}>
              {isAdded && (
                <motion.div
                  key="check-icon"
                  initial={{ opacity: 0, width: 0, scale: 0 }}
                  animate={{ opacity: 1, width: 'auto', scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    display: 'inline-flex',
                    flexShrink: 1,
                  }}
                >
                  <ListItemIcon>
                    <CheckCircleRoundedIcon fontSize="small" color="success" />
                  </ListItemIcon>
                </motion.div>
              )}
            </AnimatePresence>
            <ListItemText>{recipe.name}</ListItemText>
          </MenuItem>
        );
      })}
    </Menu>
  );
}
