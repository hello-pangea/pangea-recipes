import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import {
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import {
  useAddRecipeToRecipeBook,
  useRemoveRecipeFromRecipeBook,
  type RecipeBook,
} from '@repo/features/recipe-books';
import { getRecipeQueryOptions } from '@repo/features/recipes';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  book: RecipeBook;
  recipeId: string;
}

export function RecipeBookMenuItem({ book, recipeId }: Props) {
  const { data: recipe } = useQuery(getRecipeQueryOptions(recipeId));
  const addRecipeToRecipeBook = useAddRecipeToRecipeBook();
  const removeRecipeFromRecipeBook = useRemoveRecipeFromRecipeBook();

  if (!recipe) {
    return <CircularProgress />;
  }

  const isRecipeInBook = book.recipeIds.includes(recipeId);

  const toggleRecipeInBook = () => {
    if (
      removeRecipeFromRecipeBook.isPending ||
      addRecipeToRecipeBook.isPending
    ) {
      return;
    }

    if (isRecipeInBook) {
      removeRecipeFromRecipeBook.mutate({
        params: { id: book.id, recipeId: recipe.id },
      });
    } else {
      addRecipeToRecipeBook.mutate({
        params: { id: book.id },
        body: {
          recipeId: recipe.id,
        },
      });
    }
  };

  return (
    <MenuItem onClick={toggleRecipeInBook}>
      <AnimatePresence initial={false}>
        {isRecipeInBook && (
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
      <ListItemText>{book.name}</ListItemText>
      {book.access === 'public' ? (
        <ListItemIcon>
          <PublicRoundedIcon fontSize="small" />
        </ListItemIcon>
      ) : book.members.length > 0 ? (
        <ListItemIcon>
          <Groups2RoundedIcon fontSize="small" />
        </ListItemIcon>
      ) : null}
    </MenuItem>
  );
}
