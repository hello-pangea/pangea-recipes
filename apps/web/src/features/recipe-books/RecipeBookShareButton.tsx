import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import {
  Button,
  ButtonGroup,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { getRecipeBookQueryOptions } from '@repo/features/recipe-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { RecipeBookShareDialog } from './RecipeBookShareDialog';

interface Props {
  recipeBookId: string;
}

export function RecipeBookShareButton({ recipeBookId }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const menuOpen = Boolean(menuAnchorEl);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const { data: recipeBook } = useSuspenseQuery(
    getRecipeBookQueryOptions(recipeBookId),
  );

  const isShared =
    recipeBook.members.length > 1 ||
    recipeBook.invites.length > 0 ||
    recipeBook.access === 'public';

  const sharedWithNumber =
    recipeBook.members.length + recipeBook.invites.length - 1;

  const isPublic = recipeBook.access === 'public';

  return (
    <>
      {isSmall ? (
        <Tooltip placement="bottom" title="Share">
          <IconButton
            onClick={() => {
              setShareDialogOpen(true);
            }}
            sx={{
              color: (theme) => theme.vars.palette.primary.contrastText,
              backgroundColor: (theme) => theme.vars.palette.primary.main,
              '&:hover': {
                backgroundColor: (theme) => theme.vars.palette.primary.dark,
              },
            }}
          >
            <PersonAddRoundedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <ButtonGroup
          variant="contained"
          aria-label="share button"
          disableElevation
        >
          <Tooltip
            placement="bottom"
            title={
              !isShared
                ? 'Private only to me'
                : isPublic
                  ? 'Anyone on the internet with the link can view'
                  : `Shared with ${sharedWithNumber} ${sharedWithNumber === 1 ? 'person' : 'people'}`
            }
          >
            <Button
              onClick={() => {
                setShareDialogOpen(true);
              }}
              startIcon={
                !isShared ? (
                  <LockOutlinedIcon />
                ) : isPublic ? (
                  <PublicRoundedIcon />
                ) : (
                  <GroupRoundedIcon />
                )
              }
            >
              Share
            </Button>
          </Tooltip>
          <Tooltip placement="bottom" title={'Quick sharing actions'}>
            <Button
              id="quick-sharing-actions-button"
              size="small"
              aria-controls={
                menuOpen ? 'quick-sharing-actions-menu' : undefined
              }
              aria-expanded={menuOpen ? 'true' : undefined}
              aria-label="quick sharing actions"
              aria-haspopup="menu"
              onClick={(event) => {
                setMenuAnchorEl(event.currentTarget);
              }}
            >
              <ArrowDropDownRoundedIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      )}
      <Menu
        id="quick-sharing-actions-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => {
          setMenuAnchorEl(null);
        }}
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
            'aria-labelledby': 'quick-sharing-actions-button',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            void navigator.clipboard
              .writeText(
                `${window.location.origin}/app/recipe-books/${recipeBookId}`,
              )
              .then(() => {
                enqueueSnackbar('Link copied', {
                  variant: 'success',
                });
              });

            setMenuAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <LinkRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy link</ListItemText>
        </MenuItem>
      </Menu>
      <RecipeBookShareDialog
        recipeBookId={recipeBookId}
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
        }}
      />
    </>
  );
}
