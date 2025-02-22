import { Page } from '#src/components/Page';
import { config } from '#src/config/config';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  useCreateCanonicalIngredient,
  useUpdateCanonicalIngredient,
} from '@open-zero/features/canonical-ingredients';
import { useNavigate } from '@tanstack/react-router';
import Uppy, { type Meta } from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';

interface CanonicalIngredientFormInputs {
  name: string;
  icon: {
    id: string;
    url: string;
  } | null;
  aliases: { name: string }[];
}

interface Props {
  defaultCanonicalIngredient?: CanonicalIngredientFormInputs & { id: string };
}

export function CreateCanonicalIngredientPage({
  defaultCanonicalIngredient,
}: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<CanonicalIngredientFormInputs>({
    defaultValues: defaultCanonicalIngredient ?? {
      name: '',
      aliases: [],
    },
  });
  const {
    fields: aliases,
    append: appendAlias,
    remove: removeAlias,
  } = useFieldArray({
    control,
    name: 'aliases',
  });
  const icon = useWatch({
    control,
    name: 'icon',
    defaultValue: getValues('icon'),
  });
  const [uppy] = useState(() =>
    new Uppy<Meta, { imageUrl: string; imageId: string }>({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    })
      .use(XHR, {
        endpoint: `${config.VITE_API_URL}/images/food-icon`,
        withCredentials: true,
      })
      .on('complete', (res) => {
        const uploadRes = res.successful?.at(0);

        if (uploadRes?.response?.body) {
          const image = {
            id: uploadRes.response.body.imageId,
            url: uploadRes.response.body.imageUrl,
          };

          setValue('icon', image);

          enqueueSnackbar('Uploaded image', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar('Error uploading image', {
            variant: 'error',
          });
        }
      }),
  );

  const theme = useTheme();

  const canonicalIngredientCreator = useCreateCanonicalIngredient({
    mutationConfig: {
      onSuccess: () => {
        enqueueSnackbar('Canonical ingredient created', { variant: 'success' });
        uppy.clear();
        reset();
      },
    },
  });

  const canonicalIngredientUpdater = useUpdateCanonicalIngredient({
    mutationConfig: {
      onSuccess: () => {
        enqueueSnackbar('Canonical ingredient updated', { variant: 'success' });

        void navigate({
          to: `/app/canonical-ingredients`,
        });
      },
    },
  });

  const onSubmit: SubmitHandler<CanonicalIngredientFormInputs> = (data) => {
    if (defaultCanonicalIngredient) {
      canonicalIngredientUpdater.mutate({
        id: defaultCanonicalIngredient.id,
        name: data.name,
        iconId: data.icon?.id ?? undefined,
        aliases: data.aliases.map((alias) => alias.name),
      });
    } else {
      canonicalIngredientCreator.mutate({
        name: data.name,
        iconId: data.icon?.id ?? undefined,
        aliases: data.aliases.map((alias) => alias.name),
      });
    }
  };

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {defaultCanonicalIngredient ? 'Edit' : 'New'} canonical ingredient
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 4, maxWidth: '550px' }}
        >
          <Controller
            name="name"
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Name"
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
          {icon ? (
            <>
              <img
                src={icon.url}
                alt="Icon"
                style={{ width: 100, height: 100 }}
              />
            </>
          ) : (
            <Dashboard
              uppy={uppy}
              proudlyDisplayPoweredByUppy={false}
              showLinkToFileUploadResult={false}
              height={'300px'}
              theme={theme.palette.mode}
            />
          )}
          <Box>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Aliases
            </Typography>
            <Stack spacing={2} alignItems={'flex-start'}>
              {aliases.map((alias, index) => (
                <Stack
                  key={alias.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  width={'100%'}
                >
                  <TextFieldElement
                    placeholder="Alias"
                    name={`aliases.${index}.name`}
                    id={`aliases.${index}.name`}
                    control={control}
                    size="small"
                    fullWidth
                  />
                  <IconButton
                    onClick={() => {
                      removeAlias(index);
                    }}
                    aria-label="Remove alias"
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  appendAlias({
                    name: '',
                  });
                }}
              >
                Add alias
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          fullWidth
          type="submit"
          loading={canonicalIngredientCreator.isPending}
        >
          Save
        </Button>
      </form>
    </Page>
  );
}
