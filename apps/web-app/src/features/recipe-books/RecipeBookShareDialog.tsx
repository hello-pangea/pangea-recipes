import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useDeleteRecipeBookInvite,
  useDeleteRecipeBookMember,
  useInviteMembersToRecipeBook,
  useRecipeBook,
} from '@open-zero/features/recipes-books';
import { useEffect, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

interface Props {
  recipeBookId: string;
  open: boolean;
  onClose: () => void;
}

export function RecipeBookShareDialog({ recipeBookId, open, onClose }: Props) {
  const userId = useSignedInUserId();
  const { data: recipeBook } = useRecipeBook({ recipeBookId: recipeBookId });
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const inviteMembersToRecipeBook = useInviteMembersToRecipeBook();
  const deleteRecipeBookInvite = useDeleteRecipeBookInvite();
  const deleteRecipeBookMember = useDeleteRecipeBookMember();

  useEffect(() => {
    setInviteEmails([]);
    setInviteRole('viewer');
  }, [open]);

  if (!recipeBook) {
    return <CircularProgress />;
  }

  const myRole =
    recipeBook.members.find((member) => member.userId === userId)?.role ??
    'viewer';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share "{recipeBook.name}"</DialogTitle>
      <DialogContent>
        <Stack
          direction={'row'}
          spacing={2}
          sx={{
            mt: 0.5,
          }}
        >
          <Autocomplete
            multiple
            fullWidth
            options={[]}
            value={inviteEmails}
            onChange={(_event, newShareEmails) => {
              setInviteEmails(newShareEmails);
            }}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="outlined"
                    label={option}
                    key={key}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder={
                  inviteEmails.length <= 0 ? 'Add people by email' : undefined
                }
              />
            )}
          />
          {inviteEmails.length > 0 && (
            <FormControl sx={{ minWidth: 100 }}>
              <Select
                inputProps={{ 'aria-label': 'Permission' }}
                value={inviteRole}
                onChange={(event) => {
                  setInviteRole(event.target.value as 'editor' | 'viewer');
                }}
              >
                <MenuItem value={'editor'}>Editor</MenuItem>
                <MenuItem value={'viewer'}>Viewer</MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
        {inviteEmails.length <= 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Members
            </Typography>
            <Stack spacing={2}>
              {recipeBook.members.map((member) => (
                <Box
                  key={member.userId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <PersonRoundedIcon />
                    <Box>
                      <Typography>
                        {member.userId === userId ? '(You) ' : ''}
                        {member.name}
                      </Typography>
                      <Typography variant="caption">{member.role}</Typography>
                    </Box>
                  </Box>
                  {member.userId !== userId &&
                    (myRole == 'owner' || member.role !== 'owner') && (
                      <IconButton
                        onClick={() => {
                          deleteRecipeBookMember.mutate({
                            recipeBookId,
                            userId: member.userId,
                          });
                        }}
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    )}
                </Box>
              ))}
              {recipeBook.invites.map((invitee) => (
                <Box
                  key={invitee.inviteeEmailAddress}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <PersonRoundedIcon />
                    <Box>
                      <Typography>{invitee.inviteeEmailAddress}</Typography>
                      <Typography variant="caption">
                        Invite pending ({invitee.role})
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => {
                      deleteRecipeBookInvite.mutate({
                        recipeBookId,
                        inviteeEmailAddress: invitee.inviteeEmailAddress,
                      });
                    }}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>
      {!inviteEmails.length ? (
        <DialogActions
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
            }}
            startIcon={<LinkRoundedIcon />}
          >
            Copy link
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onClose();
            }}
          >
            Done
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            variant="text"
            onClick={() => {
              onClose();
            }}
            disabled={inviteMembersToRecipeBook.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={() => {
              inviteMembersToRecipeBook.mutate(
                {
                  emails: inviteEmails,
                  recipeBookId,
                  role: inviteRole,
                },
                {
                  onSuccess: () => {
                    onClose();
                  },
                },
              );
            }}
            loading={inviteMembersToRecipeBook.isPending}
          >
            Send
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  );
}
