import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  useDeleteRecipeBook,
  useDeleteRecipeBookMember,
  useRecipeBook,
} from '@repo/features/recipe-books';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { RecipeBookShareDialog } from './RecipeBookShareDialog';

interface Props {
  recipeBookId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDelete?: () => void;
}

export function RecipeBookMoreMenu({
  recipeBookId,
  anchorEl,
  onClose,
  onDelete,
}: Props) {
  const userId = useSignedInUserId();
  const { data: recipeBook } = useRecipeBook({ recipeBookId: recipeBookId });
  const deleteRecipeBook = useDeleteRecipeBook();
  const open = Boolean(anchorEl);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const deleteRecipeBookMember = useDeleteRecipeBookMember();

  const myRole =
    recipeBook?.members.find((member) => member.userId === userId)?.role ??
    'viewer';

  if (myRole === 'viewer') {
    return (
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
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
          onClick={() => {
            deleteRecipeBookMember.mutate({
              params: { id: recipeBookId, userId: userId },
            });

            onClose();
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Leave</ListItemText>
        </MenuItem>
      </Menu>
    );
  }

  return (
    <>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
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
        <MenuItem sx={{ p: 0 }}>
          <Link
            to="/app/recipe-books/$recipeBookId/edit"
            params={{ recipeBookId: recipeBookId }}
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
          onClick={() => {
            setShareDialogOpen(true);
            onClose();
          }}
        >
          <ListItemIcon>
            <GroupAddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        {myRole === 'owner' && <Divider />}{' '}
        {myRole === 'owner' && (
          <MenuItem
            onClick={() => {
              deleteRecipeBook.mutate({ params: { id: recipeBookId } });

              if (onDelete) {
                onDelete();
              }

              onClose();
            }}
          >
            <ListItemIcon>
              <DeleteRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
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
