import { useSignedInUserId } from '#src/features/auth/useSignedInUserId';
import { useAppForm } from '#src/hooks/form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useUpdateUser } from '@open-zero/features/users';
import { z } from 'zod/v4';

const formSchema = z.object({
  name: z.string().min(1),
});

interface Props {
  open: boolean;
  onClose: (addedName: boolean) => void;
}

export function AddNameDialog({ open, onClose }: Props) {
  const userId = useSignedInUserId();
  const updateUser = useUpdateUser();
  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.parse(value);

      updateUser.mutate(
        {
          id: userId,
          name: parsed.name,
        },
        {
          onSuccess: () => {
            onClose(true);
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <Dialog
        open={open}
        onClose={() => {
          onClose(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add your name</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Add your name so others know who you are.
          </DialogContentText>
          <Stack spacing={2}>
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name"
                  fullWidth
                  autoComplete="name"
                  required
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void form.handleSubmit();
                    }
                  }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose(false);
            }}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={updateUser.isPending}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
