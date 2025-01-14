import { RouterCardActionArea } from '#src/components/RouterCardActionArea';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRecipeBook } from '@open-zero/features/recipe-books';
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
      <Card variant="outlined">
        <RouterCardActionArea
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body1">{recipeBook.name}</Typography>
              {(recipeBook.members.length > 1 ||
                recipeBook.invites.length > 0) && (
                <Tooltip title="Shared">
                  <GroupRoundedIcon
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
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
        </RouterCardActionArea>
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
