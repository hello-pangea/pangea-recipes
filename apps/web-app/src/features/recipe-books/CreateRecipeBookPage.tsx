import { ButtonLink } from '#src/components/ButtonLink';
import { Page } from '#src/components/Page';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { emptyStringToUndefined } from '@open-zero/features';
import {
  useCreateRecipeBook,
  useUpdateRecipeBook,
} from '@open-zero/features/recipes-books';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
export interface RecipeBookFormInputs {
  name: string;
  description: string | null;
}

interface Props {
  defaultRecipeBook?: RecipeBookFormInputs & { id: string };
}

export function CreateRecipeBookPage({ defaultRecipeBook }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const form = useForm<RecipeBookFormInputs>({
    defaultValues: defaultRecipeBook ?? {
      name: '',
      description: '',
    },
  });
  const { handleSubmit, control } = form;

  const recipeBookCreator = useCreateRecipeBook({
    mutationConfig: {
      onSuccess: (createdRecipeBook) => {
        void navigate({
          to: `/recipe-books/$recipeBookId`,
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
          to: `/recipe-books/$recipeBookId`,
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
        name: data.name,
        description: emptyStringToUndefined(data.description),
      });
    } else {
      recipeBookCreator.mutate({
        name: data.name,
        description: emptyStringToUndefined(data.description),
      });
    }
  };

  return (
    <Page>
      <ButtonLink
        size="small"
        startIcon={<ChevronLeftRoundedIcon />}
        color="inherit"
        to="/recipe-books"
      >
        Back
      </ButtonLink>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1">
          {defaultRecipeBook ? 'Edit recipe book' : 'New recipe book'}
        </Typography>
      </Box>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction={'column'}
            spacing={2}
            sx={{ mb: 4, maxWidth: '750px', display: 'block' }}
          >
            <TextFieldElement
              label="Recipe book name"
              name="name"
              required
              control={control}
              fullWidth
            />
            <TextFieldElement
              label="Description"
              name="description"
              control={control}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
          <LoadingButton
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            type="submit"
            loading={recipeBookCreator.isPending}
            sx={{
              display: 'flex',
            }}
          >
            Save
          </LoadingButton>
        </form>
      </FormProvider>
    </Page>
  );
}
