import { Page } from '#src/components/Page';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useCreateRecipe,
  useFoods,
  useRecipes,
  useUnits,
  useUpdateRecipe,
} from '@open-zero/features';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { AutocompleteElement, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { ImportRecipeDialog } from './ImportRecipeDialog';
import { RequiredRecipeCard } from './RequiredRecipeCard';

interface NewRecipeFormInputs {
  name: string;
  description: string | null;
  prepTime?: string;
  cookTime?: string;
  ingredients: {
    foodId: string;
    unitId: string | null;
    amount: number | null;
    notes?: string;
  }[];
  usesRecipes: { recipeId: string }[];
  instructions: { text: string }[];
}

interface Props {
  defaultRecipe?: NewRecipeFormInputs & { id: string };
}

export function CreateRecipePage({ defaultRecipe }: Props) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { handleSubmit, control, setValue } = useForm<NewRecipeFormInputs>({
    defaultValues: defaultRecipe ?? {
      name: '',
      description: '',
      prepTime: '',
      cookTime: '',
      ingredients: [],
      usesRecipes: [],
      instructions: [],
    },
  });
  const {
    fields: ingredients,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });
  const {
    fields: usesRecipes,
    append: appendRecipe,
    remove: removeRecipe,
  } = useFieldArray({
    control,
    name: 'usesRecipes',
  });
  const {
    fields: instructions,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: 'instructions',
  });

  const foodsQuery = useFoods();

  const unitsQuery = useUnits();

  const recipesQuery = useRecipes();

  const recipeCreator = useCreateRecipe({
    config: {
      onSuccess: (data) => {
        navigate(`/recipes/${data.recipe.id}`);
      },
    },
  });

  const recipeUpdater = useUpdateRecipe({
    config: {
      onSuccess: (data) => {
        enqueueSnackbar('Recipe updated', { variant: 'success' });

        navigate(`/recipes/${data.recipe.id}`);
      },
    },
  });

  console.log(defaultRecipe, ingredients);

  const onSubmit: SubmitHandler<NewRecipeFormInputs> = (data) => {
    console.log('Create recipe:', data);

    if (defaultRecipe) {
      recipeUpdater.mutate({
        id: defaultRecipe.id,
        name: data.name,
        description: data.description || undefined,
        ingredients: data.ingredients,
        instructions: data.instructions.map((i) => i.text),
      });
    } else {
      recipeCreator.mutate({
        name: data.name,
        description: data.description || undefined,
        cookTime: data.cookTime ? parseInt(data.cookTime) : undefined,
        prepTime: data.prepTime ? parseInt(data.prepTime) : undefined,
        ingredients: data.ingredients,
        instructions: data.instructions.map((i) => i.text),
      });
    }
  };

  return (
    <Page>
      <Button
        size="small"
        startIcon={<ChevronLeftRoundedIcon />}
        href="/recipes"
        color="inherit"
      >
        Back
      </Button>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1">
          {defaultRecipe ? 'Edit recipe' : 'New recipe'}
        </Typography>
        <Button
          size="small"
          startIcon={<LinkRoundedIcon />}
          onClick={() => setImportDialogOpen(true)}
        >
          Import from url
        </Button>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 6, maxWidth: '750px', display: 'block' }}
        >
          <TextFieldElement
            label="Recipe name"
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
          <Stack direction={'row'} spacing={2}>
            <TextFieldElement
              label="Prep time (m)"
              name="prepTime"
              control={control}
              fullWidth
            />
            <TextFieldElement
              label="Cook time (m)"
              name="cookTime"
              control={control}
              fullWidth
            />
          </Stack>
        </Stack>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Required recipes
        </Typography>
        {usesRecipes.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {usesRecipes.map((usesRecipe, index) => (
              <Grid item key={usesRecipe.recipeId} xs={12} md={4} lg={3}>
                <RequiredRecipeCard
                  recipeId={usesRecipe.recipeId}
                  onRemove={() => {
                    removeRecipe(index);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        <Autocomplete
          options={
            recipesQuery.data?.recipes.map((r) => {
              return { label: r.name, id: r.id };
            }) ?? []
          }
          size="small"
          renderInput={(params) => (
            <TextField {...params} label="Add required recipe" />
          )}
          onChange={(_, value) => {
            if (value) {
              appendRecipe({ recipeId: value.id });
            }
          }}
          sx={{
            mb: 6,
            maxWidth: 300,
          }}
        />
        <Typography variant="h2" sx={{ mb: 2 }}>
          Ingredients
        </Typography>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 2, maxWidth: '750px', display: 'block' }}
        >
          {ingredients.map((field, index) => {
            return (
              <Stack direction={'row'} spacing={1} key={field.id}>
                <TextFieldElement
                  label="Amount"
                  name={`ingredients.${index}.amount`}
                  id={`ingredients.${index}.amount`}
                  type="number"
                  required
                  control={control}
                  size="small"
                  sx={{
                    minWidth: 100,
                  }}
                />
                <AutocompleteElement
                  label="Unit"
                  name={`ingredients.${index}.unitId`}
                  options={
                    unitsQuery.data?.units.map((u) => {
                      return { label: u.abbreviation ?? u.name, id: u.id };
                    }) ?? []
                  }
                  control={control}
                  required
                  matchId
                  autocompleteProps={{
                    size: 'small',
                    autoHighlight: true,
                    disableClearable: true,
                    sx: {
                      minWidth: 150,
                    },
                  }}
                />
                <AutocompleteElement
                  name={`ingredients.${index}.foodId`}
                  label="Ingredient"
                  options={
                    foodsQuery.data?.foods.map((i) => {
                      return { label: i.name, id: i.id };
                    }) ?? []
                  }
                  control={control}
                  required
                  matchId
                  autocompleteProps={{
                    autoHighlight: true,
                    fullWidth: true,
                    size: 'small',
                    onKeyDown: (e) => {
                      if (e.key === 'Tab') {
                        appendIngredient({
                          foodId: '',
                          unitId: '',
                          amount: 0,
                        });

                        // run this code in 50ms
                        setTimeout(() => {
                          document
                            .getElementById(`ingredients.${index + 1}.amount`)
                            ?.focus();
                        }, 50);
                      }
                    },
                  }}
                />
                <TextFieldElement
                  label="Notes"
                  name={`ingredients.${index}.notes`}
                  control={control}
                  size="small"
                  sx={{
                    minWidth: 200,
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    removeIngredient(index);
                  }}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() =>
            appendIngredient({ foodId: '', unitId: '', amount: 0 })
          }
          sx={{ mb: 6 }}
        >
          Add ingredient
        </Button>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Instructions
        </Typography>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 2, maxWidth: '750px', display: 'block' }}
        >
          {instructions.map((field, index) => {
            return (
              <Stack
                direction={'row'}
                alignItems={'flex-start'}
                spacing={2}
                key={field.id}
              >
                <Typography
                  component={'p'}
                  variant="h1"
                  sx={{
                    width: 40,
                    color: (theme) => theme.palette.text.secondary,
                  }}
                >
                  {index + 1}.
                </Typography>
                <TextFieldElement
                  name={`instructions.${index}.text`}
                  placeholder="Add the secret ingredient!"
                  required
                  control={control}
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    removeInstruction(index);
                  }}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() => appendInstruction({ text: '' })}
          sx={{ mb: 6 }}
        >
          Add instruction
        </Button>
        <LoadingButton
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          type="submit"
          loading={recipeCreator.isPending}
          sx={{
            display: 'flex',
          }}
        >
          Save
        </LoadingButton>
      </form>
      <ImportRecipeDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={(importedRecipe) => {
          setImportDialogOpen(false);

          importedRecipe.name && setValue('name', importedRecipe.name);
          importedRecipe.description &&
            setValue('description', importedRecipe.description);
          importedRecipe.instructions &&
            setValue(
              'instructions',
              importedRecipe.instructions.map((i) => ({ text: i })),
            );
          importedRecipe.ingredients &&
            setValue(
              'ingredients',
              importedRecipe.ingredients.map((i) => {
                if (typeof i === 'string') {
                  return { amount: 0, foodId: '', unitId: '', notes: i };
                } else {
                  return {
                    foodId: '',
                    unitId: i.unit ?? '',
                    amount: i.amount ?? 0,
                    notes: i.name ?? '',
                  };
                }
              }),
            );
        }}
      />
    </Page>
  );
}
