import { useSignedInUserId } from '#src/features/auth/useSignedInUserId';
import { focusNextInput } from '#src/lib/focusNextInput';
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
  firstName: string;
  lastName: string | null;
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
      firstName: '',
      lastName: null,
    },
  });

  const onSubmit: SubmitHandler<NameFormInputs> = (data) => {
    updateUser.mutate(
      {
        id: userId,
        firstName: data.firstName,
        lastName: data.lastName,
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
              label="First name"
              name="firstName"
              control={control}
              fullWidth
              required
              onKeyDown={(event) => {
                focusNextInput(event, 'input[name="lastName"]');
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
            <TextFieldElement
              label="Last name"
              name="lastName"
              control={control}
              fullWidth
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void handleSubmit(onSubmit)();
                }
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
