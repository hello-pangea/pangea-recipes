import { CardActionAreaLink } from '#src/components/CardActionAreaLink';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useRecipeBook } from '@open-zero/features/recipes-books';
import { useState } from 'react';
import { RecipeBookMoreMenu } from './RecipeBookMoreMenu';

interface Props {
  recipeBookId: string;
}

export function RecipeBookCard({ recipeBookId }: Props) {
  const recipeBookQuery = useRecipeBook({ recipeBookId: recipeBookId });
  const recipeBook = recipeBookQuery.data?.recipeBook;
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  if (!recipeBook) {
    return <CircularProgress />;
  }

  return (
    <>
      <Card variant="outlined">
        <CardActionAreaLink
          to="/recipe-books/$recipeBookId"
          params={{
            recipeBookId: recipeBookId,
          }}
        >
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={'/assets/lil-guy.svg'}
              height={100}
              width={'100%'}
              style={{ objectFit: 'contain', display: 'block' }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
            }}
          >
            <Typography variant="body1">{recipeBook.name}</Typography>
            <IconButton
              id="more-button"
              aria-controls={moreMenuOpen ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={moreMenuOpen ? 'true' : undefined}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setMoreMenuAnchorEl(event.currentTarget);
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              <MoreVertRoundedIcon />
            </IconButton>
          </Box>
        </CardActionAreaLink>
      </Card>
      <RecipeBookMoreMenu
        recipeBookId={recipeBookId}
        anchorEl={moreMenuAnchorEl}
        onClose={() => {
          setMoreMenuAnchorEl(null);
        }}
      />
    </>
  );
}
