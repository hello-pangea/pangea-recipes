import { Page } from '#src/components/Page';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography } from '@mui/material';
import { useCreateFood } from '@open-zero/features';
import { useSnackbar } from 'notistack';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
  name: string;
  pluralName: string;
}

export function NewFoodPage() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      pluralName: '',
    },
  });

  const foodCreator = useCreateFood({
    mutationConfig: {
      onSuccess: () => {
        enqueueSnackbar('Food created', { variant: 'success' });
        reset();
      },
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    foodCreator.mutate({
      name: data.name,
      pluralName: data.pluralName || undefined,
    });
  };

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        New ingredient
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 4, maxWidth: '550px', display: 'block' }}
        >
          <Controller
            name="name"
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Ingredient name"
                placeholder="Example: Carrot"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : undefined}
                {...field}
              />
            )}
          />
          <Controller
            name="pluralName"
            defaultValue={''}
            control={control}
            render={({ field }) => (
              <TextField
                label="Plural name"
                placeholder="Example: Carrots"
                variant="outlined"
                fullWidth
                error={!!errors.pluralName}
                helperText={
                  errors.pluralName ? errors.pluralName.message : 'Optional'
                }
                {...field}
              />
            )}
          />
        </Stack>
        <LoadingButton
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          fullWidth
          type="submit"
          loading={foodCreator.isPending}
        >
          Save
        </LoadingButton>
      </form>
    </Page>
  );
}
