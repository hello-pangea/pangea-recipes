import { Page } from '#src/components/Page';
import { config } from '#src/config/config';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography, useTheme } from '@mui/material';
import { useCreateFood } from '@open-zero/features';
import Uppy, { type Meta } from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
  name: string;
  pluralName: string;
  iconId?: string;
}

export function NewFoodPage() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      pluralName: '',
    },
  });
  const [uppy] = useState(() =>
    new Uppy<Meta, { image_url: string; image_id: string }>({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    })
      .use(XHR, { endpoint: `${config.VITE_API_URL}/images/food-icon` })
      .once('complete', (res) => {
        const uploadRes = res.successful?.at(0);

        if (uploadRes?.response?.body) {
          const image = {
            id: uploadRes.response.body.image_id,
            url: uploadRes.response.body.image_url,
          };

          setValue('iconId', image.id);

          enqueueSnackbar('Uploaded image', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar('Error uploading image', {
            variant: 'error',
          });
        }

        uppy.clear();
      }),
  );

  const theme = useTheme();

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
      iconId: data.iconId,
    });
  };

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        New food
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
                label="Food name"
                placeholder="Example: Carrot"
                variant="outlined"
                fullWidth
                required
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
                  errors.pluralName ? errors.pluralName.message : undefined
                }
                {...field}
              />
            )}
          />
          <Dashboard
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            showLinkToFileUploadResult={false}
            height={'300px'}
            theme={theme.palette.mode}
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
