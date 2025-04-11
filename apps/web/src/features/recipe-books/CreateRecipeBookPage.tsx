import { Page } from '#src/components/Page';
import { focusNextInput } from '#src/lib/focusNextInput';
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
import { emptyStringToUndefined } from '@open-zero/features';
import {
  useCreateRecipeBook,
  useUpdateRecipeBook,
  type RecipeBook,
} from '@open-zero/features/recipe-books';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import {
  FormProvider,
  useForm,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';

export interface RecipeBookFormInputs {
  recipeBookName: string;
  description: string | null;
  access: RecipeBook['access'];
}

interface Props {
  defaultRecipeBook?: RecipeBookFormInputs & { id: string };
}

export function CreateRecipeBookPage({ defaultRecipeBook }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const form = useForm<RecipeBookFormInputs>({
    defaultValues: defaultRecipeBook ?? {
      recipeBookName: '',
      description: '',
      access: 'public',
    },
  });
  const { handleSubmit, control, setValue } = form;
  const access = useWatch({ control, name: 'access' });
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

  const onSubmit: SubmitHandler<RecipeBookFormInputs> = (data) => {
    if (defaultRecipeBook) {
      recipeBookUpdater.mutate({
        id: defaultRecipeBook.id,
        name: data.recipeBookName,
        description: emptyStringToUndefined(data.description),
      });
    } else {
      recipeBookCreator.mutate({
        name: data.recipeBookName,
        description: emptyStringToUndefined(data.description),
        access: data.access,
      });
    }
  };

  return (
    <Page>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1">
          {defaultRecipeBook ? 'Edit recipe book' : 'New recipe book'}
        </Typography>
      </Box>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={3}
            sx={{
              mb: 4,
              maxWidth: '750px',
            }}
          >
            <Grid size={12}>
              <TextFieldElement
                label="Recipe book name"
                id="recipeBookName"
                name="recipeBookName"
                control={control}
                fullWidth
                multiline
                onKeyDown={(event) => {
                  focusNextInput(event, 'textarea[name="description"]');
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextFieldElement
                label="Description"
                id="description"
                name="description"
                control={control}
                multiline
                fullWidth
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
      </FormProvider>
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
            setValue('access', 'private');

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
            setValue('access', 'public');

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
