import { Page } from '#src/components/Page';
import { focusNextInput } from '#src/lib/focusNextInput';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { Box, Button, Grid2, Typography } from '@mui/material';
import { emptyStringToUndefined } from '@open-zero/features';
import {
  useCreateRecipeBook,
  useUpdateRecipeBook,
} from '@open-zero/features/recipe-books';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';

export interface RecipeBookFormInputs {
  recipeBookName: string;
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
      recipeBookName: '',
      description: '',
    },
  });
  const { handleSubmit, control } = form;

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
          <Grid2
            container
            spacing={3}
            sx={{
              mb: 4,
              maxWidth: '750px',
            }}
          >
            <Grid2 size={12}>
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
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextFieldElement
                label="Description"
                id="description"
                name="description"
                control={control}
                multiline
                fullWidth
              />
            </Grid2>
          </Grid2>
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
    </Page>
  );
}
