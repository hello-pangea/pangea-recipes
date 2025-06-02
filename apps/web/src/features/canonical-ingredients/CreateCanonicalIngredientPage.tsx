import { Page } from '#src/components/Page';
import { config } from '#src/config/config';
import { useAppForm } from '#src/hooks/form';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  useCreateCanonicalIngredient,
  useUpdateCanonicalIngredient,
} from '@open-zero/features/canonical-ingredients';
import { useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import Uppy, { type Meta } from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { z } from 'zod/v4';

const formSchema = z.object({
  name: z.string(),
  icon: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable(),
  aliases: z.array(
    z.object({
      name: z.string().min(1, { message: 'Alias cannot be empty' }),
    }),
  ),
});
type CanonicalIngredientFormInputs = z.infer<typeof formSchema>;

interface Props {
  defaultValues?: CanonicalIngredientFormInputs;
  updateCanonicalIngredientId?: string;
}

export function CreateCanonicalIngredientPage({
  defaultValues,
  updateCanonicalIngredientId,
}: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const form = useAppForm({
    defaultValues: defaultValues ?? {
      name: '',
      aliases: [],
      icon: null,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.parse(value);

      if (updateCanonicalIngredientId) {
        canonicalIngredientUpdater.mutate({
          id: updateCanonicalIngredientId,
          name: parsed.name,
          iconId: parsed.icon?.id ?? undefined,
          aliases: parsed.aliases.map((alias) => alias.name),
        });
      } else {
        canonicalIngredientCreator.mutate({
          name: parsed.name,
          iconId: parsed.icon?.id ?? undefined,
          aliases: parsed.aliases.map((alias) => alias.name),
        });
      }
    },
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

          form.setFieldValue('icon', image);

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
        form.reset();
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

  const iconUrl = useStore(form.store, (state) => state.values.icon?.url);

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {updateCanonicalIngredientId ? 'Edit' : 'New'} canonical ingredient
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 4, maxWidth: '550px' }}
        >
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField
                label="Name"
                placeholder="Example: Carrot"
                variant="outlined"
                fullWidth
                required
              />
            )}
          />
          {iconUrl ? (
            <>
              <img
                src={iconUrl}
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
            <form.Field name="aliases" mode="array">
              {(field) => {
                return (
                  <Stack spacing={2} alignItems={'flex-start'}>
                    {field.state.value.map((_, i) => {
                      return (
                        <Stack
                          key={i}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          width={'100%'}
                        >
                          <form.AppField
                            name={`aliases[${i}].name`}
                            children={(subField) => (
                              <subField.TextField
                                placeholder="Alias"
                                size="small"
                                fullWidth
                              />
                            )}
                          />
                          <IconButton
                            onClick={() => {
                              field.removeValue(i);
                            }}
                            aria-label="Remove alias"
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                        </Stack>
                      );
                    })}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => {
                        field.pushValue({
                          name: '',
                        });
                      }}
                    >
                      Add alias
                    </Button>
                  </Stack>
                );
              }}
            </form.Field>
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
