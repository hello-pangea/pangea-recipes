import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface InviteOption {
  id: string;
  label: string;
}

const fakeMembers = [
  {
    name: 'You',
    userId: '1',
    role: 'Owner',
  },
  {
    name: 'Mom',
    userId: '2',
    role: 'Editor',
  },
  {
    name: 'Brother',
    userId: '3',
    role: 'Viewer',
  },
];

export function ShareDialogDemo() {
  const [invites, setInvites] = useState<InviteOption[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: '28px',
        p: 3,
        boxShadow:
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}
    >
      <Typography variant="h2" sx={{ pb: 2 }}>
        Share "Family Recipe Book"
      </Typography>
      <Autocomplete
        multiple
        fullWidth
        options={[
          {
            id: '4',
            label: 'Sister',
          },
          {
            id: '4',
            label: 'Dad',
          },
        ]}
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
        sx={{ mb: 4 }}
      />
      <Typography variant="h3" sx={{ mb: 2 }}>
        Members
      </Typography>
      <Stack spacing={2}>
        {fakeMembers.map((member) => (
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
                <Typography>{member.name}</Typography>
                <Typography variant="caption">{member.role}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
      <Button
        variant="outlined"
        onClick={() => {
          void navigator.clipboard
            .writeText(`${window.location.origin}/sign-up`)
            .then(() => {
              setLinkCopied(true);
              setTimeout(() => {
                setLinkCopied(false);
              }, 3000);
            });
        }}
        startIcon={linkCopied ? <CheckRoundedIcon /> : <LinkRoundedIcon />}
        color={linkCopied ? 'success' : 'primary'}
        sx={{ mt: 3 }}
      >
        {linkCopied ? 'Link copied' : 'Copy link'}
      </Button>
    </Box>
  );
}
