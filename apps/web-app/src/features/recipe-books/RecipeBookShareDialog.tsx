import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
  alpha,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  createFilterOptions,
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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  useAcceptRecipeBookRequest,
  useDeclineRecipeBookRequest,
} from '@open-zero/features/recipe-book-requests';
import {
  useDeleteRecipeBookInvite,
  useDeleteRecipeBookMember,
  useInviteMembersToRecipeBook,
  useRecipeBook,
  useRecipeBooks,
} from '@open-zero/features/recipe-books';
import { useEffect, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

interface InviteOption {
  id: string;
  label: string;
  userId?: string;
  email?: string;
}

const filter = createFilterOptions<InviteOption>();

interface Props {
  recipeBookId: string;
  open: boolean;
  onClose: () => void;
}

export function RecipeBookShareDialog({ recipeBookId, open, onClose }: Props) {
  const userId = useSignedInUserId();
  const { data: recipeBook } = useRecipeBook({ recipeBookId: recipeBookId });
  const [invites, setInvites] = useState<InviteOption[]>([]);
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const inviteMembersToRecipeBook = useInviteMembersToRecipeBook();
  const deleteRecipeBookInvite = useDeleteRecipeBookInvite();
  const deleteRecipeBookMember = useDeleteRecipeBookMember();
  const acceptRecipeBookRequest = useAcceptRecipeBookRequest();
  const declineRecipeBookRequest = useDeclineRecipeBookRequest();
  const { data: recipeBooks } = useRecipeBooks({
    options: {
      userId: userId,
    },
  });
  const [linkCopied, setLinkCopied] = useState(false);
  const [reviewRequestId, setReviewRequestId] = useState<string | null>(null);

  const invitedEmails = [
    ...new Set(
      (
        recipeBooks?.map((recipeBook) =>
          recipeBook.invites.map((invite) => invite.inviteeEmailAddress),
        ) ?? []
      ).flat(),
    ),
  ].filter((email) =>
    recipeBook?.invites.every((invite) => invite.inviteeEmailAddress !== email),
  );
  const knownMembers =
    recipeBooks
      ?.map((recipeBook) =>
        recipeBook.members.map((member) => ({
          userId: member.userId,
          name: `${member.firstName}${member.lastName ? ` ${member.lastName}` : ''}`,
        })),
      )
      .flat()
      .filter(
        (member, index, arr) =>
          arr.findIndex((m) => m.userId === member.userId) === index &&
          member.userId !== userId &&
          recipeBook?.members.every(
            (recipeBookMember) => recipeBookMember.userId !== member.userId,
          ),
      ) ?? [];
  const inviteOptions: InviteOption[] = [
    ...invitedEmails.map((email) => ({ id: email, label: email, email })),
    ...knownMembers.map((member) => ({
      id: member.userId,
      label: member.name,
      userId: member.userId,
    })),
  ];

  useEffect(() => {
    resetInviteForm();
  }, [open]);

  function resetInviteForm() {
    setInvites([]);
    setInviteRole('viewer');
    setLinkCopied(false);
  }

  if (!recipeBook) {
    return <CircularProgress />;
  }

  const myRole =
    recipeBook.members.find((member) => member.userId === userId)?.role ??
    'viewer';

  return (
    <>
      <Dialog
        open={open && !reviewRequestId}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share "{recipeBook.name}"</DialogTitle>
        <DialogContent>
          {recipeBook.requests.length > 0 && (
            <Stack spacing={2} sx={{ mb: 2 }}>
              {recipeBook.requests.map((request) => (
                <Box
                  key={request.id}
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 0.5,
                  }}
                >
                  <Typography>
                    {request.firstName}
                    {request.lastName ? ` ${request.lastName}` : ''} requested
                    to join
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => {
                      setReviewRequestId(request.id);
                    }}
                  >
                    Review
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
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
              options={inviteOptions}
              value={invites}
              onChange={(_event, newShareEmails) => {
                setInvites(
                  newShareEmails.map((invite) =>
                    typeof invite === 'string'
                      ? {
                          label: invite,
                          id: invite,
                          email: invite,
                        }
                      : invite,
                  ),
                );
              }}
              freeSolo
              renderTags={(value: readonly InviteOption[], getTagProps) =>
                value.map((option: InviteOption, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      variant="outlined"
                      label={option.label}
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
                    invites.length <= 0 ? 'Add by email or name' : undefined
                  }
                />
              )}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.email,
                );

                const isEmail = isMaybeValidEmail(inputValue);

                if (inputValue !== '' && !isExisting && isEmail) {
                  filtered.push({
                    // inputValue,
                    label: inputValue,
                    id: inputValue,
                    email: inputValue,
                  });
                }

                return filtered;
              }}
            />
            {invites.length > 0 && (
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
          {invites.length <= 0 && (
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
                        gap: 2,
                      }}
                    >
                      <PersonRoundedIcon />
                      <Box>
                        <Typography>
                          {member.userId === userId ? '(You) ' : ''}
                          {member.firstName}
                          {member.lastName ? ` ${member.lastName}` : ''}
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
                        gap: 2,
                      }}
                    >
                      <Tooltip title="We sent an invite to their email">
                        <EmailRoundedIcon />
                      </Tooltip>
                      <Box>
                        <Typography>{invitee.inviteeEmailAddress}</Typography>
                        <Typography variant="caption">
                          Invite sent ({invitee.role})
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
        {!invites.length ? (
          <DialogActions
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                void navigator.clipboard
                  .writeText(
                    `${window.location.origin}/app/recipe-books/${recipeBookId}`,
                  )
                  .then(() => {
                    setLinkCopied(true);
                    setTimeout(() => {
                      setLinkCopied(false);
                    }, 3000);
                  });
              }}
              startIcon={
                linkCopied ? <CheckRoundedIcon /> : <LinkRoundedIcon />
              }
              color={linkCopied ? 'success' : 'primary'}
            >
              {linkCopied ? 'Link copied' : 'Copy link'}
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
                resetInviteForm();
              }}
              disabled={inviteMembersToRecipeBook.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                inviteMembersToRecipeBook.mutate(
                  {
                    emails: invites
                      .map((invite) => invite.email)
                      .filter((email) => email !== undefined),
                    userIds: invites
                      .map((invite) => invite.userId)
                      .filter((userId) => userId !== undefined),
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
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Dialog
        open={Boolean(reviewRequestId)}
        onClose={() => {
          setReviewRequestId(null);
          onClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            pt: 3,
            pb: 2,
            gap: 2,
          }}
        >
          <IconButton
            onClick={() => {
              setReviewRequestId(null);
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <DialogTitle sx={{ p: 0 }}>Request for access</DialogTitle>
        </Box>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {
              recipeBook.requests.find(
                (request) => request.id === reviewRequestId,
              )?.firstName
            }
            {recipeBook.requests.find(
              (request) => request.id === reviewRequestId,
            )?.lastName
              ? ` ${recipeBook.requests.find((request) => request.id === reviewRequestId)?.lastName}`
              : ''}{' '}
            requested to join {recipeBook.name}.
          </Typography>
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
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              if (!reviewRequestId) {
                return;
              }

              declineRecipeBookRequest.mutate(reviewRequestId, {
                onSuccess: () => {
                  setReviewRequestId(null);
                },
              });
            }}
            disabled={acceptRecipeBookRequest.isPending}
            loading={declineRecipeBookRequest.isPending}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!reviewRequestId) {
                return;
              }

              acceptRecipeBookRequest.mutate(
                { recipeBookRequestId: reviewRequestId, role: inviteRole },
                {
                  onSuccess: () => {
                    setReviewRequestId(null);
                  },
                },
              );
            }}
            disabled={declineRecipeBookRequest.isPending}
            loading={acceptRecipeBookRequest.isPending}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function isMaybeValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
}
