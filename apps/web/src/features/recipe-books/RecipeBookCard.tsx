import { RouterLink } from '#src/components/RouterLink';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { useRecipeBook } from '@open-zero/features/recipe-books';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { RecipeBookMoreMenu } from './RecipeBookMoreMenu';

interface Props {
  recipeBookId: string;
}

export function RecipeBookCard({ recipeBookId }: Props) {
  const { data: recipeBook } = useRecipeBook({ recipeBookId: recipeBookId });
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  if (!recipeBook) {
    return <CircularProgress />;
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          '&:hover': {
            boxShadow:
              '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          },
        }}
      >
        <Link
          to="/app/recipe-books/$recipeBookId"
          params={{
            recipeBookId: recipeBookId,
          }}
          draggable={false}
          tabIndex={-1}
        >
          <img
            src={'/assets/recipe-book.jpg'}
            height={200}
            width={'100%'}
            style={{ objectFit: 'cover', display: 'block' }}
            draggable={false}
          />
        </Link>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <RouterLink
              to="/app/recipe-books/$recipeBookId"
              params={{
                recipeBookId: recipeBookId,
              }}
              draggable={false}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {recipeBook.name}
            </RouterLink>
            {(recipeBook.members.length > 1 ||
              recipeBook.invites.length > 0 ||
              recipeBook.access === 'public') && (
              <Tooltip title="Shared">
                <GroupRoundedIcon
                  sx={{
                    color: (theme) => theme.vars.palette.text.secondary,
                  }}
                  fontSize="inherit"
                />
              </Tooltip>
            )}
          </Stack>
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
