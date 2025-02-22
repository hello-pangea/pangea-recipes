import { useSignedInUserId } from '#src/features/auth/useSignedInUserId';
import { isBlank } from '#src/lib/isBlank';
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
import { useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';

interface NameFormInputs {
  name: string;
}

interface Props {
  open: boolean;
  onClose: (addedName: boolean) => void;
}

export function AddNameDialog({ open, onClose }: Props) {
  const userId = useSignedInUserId();
  const updateUser = useUpdateUser();
  const { handleSubmit, control } = useForm<NameFormInputs>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit: SubmitHandler<NameFormInputs> = (data) => {
    updateUser.mutate(
      {
        id: userId,
        name: data.name,
      },
      {
        onSuccess: () => {
          onClose(true);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            <TextFieldElement
              label="Name"
              name="name"
              control={control}
              fullWidth
              required
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void handleSubmit(onSubmit)();
                }
              }}
              rules={{
                validate: (value) => {
                  if (isBlank(value)) {
                    return 'First name cannot be blank';
                  }

                  return true;
                },
              }}
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
