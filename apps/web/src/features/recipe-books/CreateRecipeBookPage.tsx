import { Page } from '#src/components/Page';
import { useAppForm } from '#src/hooks/form';
import { focusNextInput } from '#src/utils/focusNextInput';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { emptyStringToUndefined } from '@repo/features';
import {
  useCreateRecipeBook,
  useUpdateRecipeBook,
} from '@repo/features/recipe-books';
import { useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  recipeBookName: z.string().min(1, { message: 'Name is required' }),
  description: z
    .string()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  access: z.enum(['public', 'private']),
});
type RecipeBookFormInputs = z.infer<typeof formSchema>;

interface Props {
  defaultValues?: RecipeBookFormInputs;
  updateRecipeBookId?: string;
}

export function CreateRecipeBookPage({
  defaultValues,
  updateRecipeBookId,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [generalAccessMenuAnchorEl, setGeneralAccessMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const recipeBookCreator = useCreateRecipeBook({
    mutationConfig: {
      onSuccess: (createdRecipeBook) => {
        void navigate({
          to: `/app/recipe-books/$recipeBookId`,
          params: {
            recipeBookId: createdRecipeBook.id,
          },
        });
      },
    },
  });

  const recipeBookUpdater = useUpdateRecipeBook({
    mutationConfig: {
      onSuccess: (updatedRecipeBook) => {
        enqueueSnackbar('Recipe book updated', { variant: 'success' });

        void navigate({
          to: `/app/recipe-books/$recipeBookId`,
          params: {
            recipeBookId: updatedRecipeBook.id,
          },
        });
      },
    },
  });

  const form = useAppForm({
    defaultValues: defaultValues ?? {
      recipeBookName: '',
      description: '',
      access: 'public',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.parse(value);

      if (updateRecipeBookId) {
        recipeBookUpdater.mutate({
          params: { id: updateRecipeBookId },
          body: {
            name: parsed.recipeBookName,
            description: emptyStringToUndefined(parsed.description),
          },
        });
      } else {
        recipeBookCreator.mutate({
          body: {
            name: parsed.recipeBookName,
            description: emptyStringToUndefined(parsed.description),
            access: parsed.access,
          },
        });
      }
    },
  });

  const access = useStore(form.store, (state) => state.values.access);

  return (
    <Page>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1">
          {updateRecipeBookId ? 'Edit book' : 'New book'}
        </Typography>
      </Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
            maxWidth: '750px',
          }}
        >
          <Grid size={12}>
            <form.AppField
              name="recipeBookName"
              children={(field) => (
                <field.TextField
                  label="Name"
                  autoComplete="off"
                  fullWidth
                  multiline
                  onKeyDown={(event) => {
                    focusNextInput(event, 'textarea[name="description"]');
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField label="Description" fullWidth multiline />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Box
              sx={{
                borderRadius: 1,
                p: 2,
                bgcolor: (theme) => theme.vars.palette.background.paper,
              }}
            >
              <Typography variant="h3" sx={{ mb: 2 }}>
                General access
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: (theme) =>
                      access === 'public'
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.text.primary, 0.1),
                    color: (theme) =>
                      access === 'public'
                        ? theme.vars.palette.success.main
                        : theme.vars.palette.text.primary,
                  }}
                >
                  {access === 'public' ? (
                    <PublicRoundedIcon />
                  ) : (
                    <LockOutlinedIcon />
                  )}
                </Avatar>
                <Box>
                  <Button
                    color="inherit"
                    endIcon={<ArrowDropDownRoundedIcon />}
                    sx={{ ml: -1, mb: 0.5 }}
                    onClick={(event) => {
                      setGeneralAccessMenuAnchorEl(event.currentTarget);
                    }}
                  >
                    {access === 'public'
                      ? 'Anyone with the link'
                      : 'Restricted'}
                  </Button>
                  <Typography variant="caption">
                    {access === 'public'
                      ? 'Anyone on the internet with the link can view'
                      : 'Only people with access can open with the link'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          type="submit"
          loading={recipeBookCreator.isPending}
          sx={{
            display: 'flex',
          }}
        >
          Save
        </Button>
      </form>
      <Menu
        anchorEl={generalAccessMenuAnchorEl}
        open={Boolean(generalAccessMenuAnchorEl)}
        onClose={() => {
          setGeneralAccessMenuAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          selected={access === 'private'}
          onClick={() => {
            form.setFieldValue('access', 'private');

            setGeneralAccessMenuAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <LockOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Restricted</ListItemText>
        </MenuItem>
        <MenuItem
          selected={access === 'public'}
          onClick={() => {
            form.setFieldValue('access', 'public');

            setGeneralAccessMenuAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <PublicRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Anyone with the link</ListItemText>
        </MenuItem>
      </Menu>
    </Page>
  );
}
