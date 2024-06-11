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
  unitRecord,
  useCreateRecipe,
  useFoods,
  useRecipes,
  useUpdateRecipe,
  type Unit,
} from '@open-zero/features';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form';
import { AutocompleteElement, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { CreateInstructionGroup } from './CreateInstructionGroup';
import { ImportRecipeDialog } from './ImportRecipeDialog';
import { RequiredRecipeCard } from './RequiredRecipeCard';

interface FoodOption {
  inputValue?: string;
  name: string;
  id?: string;
}

export interface RecipeFormInputs {
  name: string;
  description: string | null;
  prepTime: string;
  cookTime: string;
  ingredients: {
    food: FoodOption;
    unit: Unit | null;
    amount: number | null;
    notes: string | null;
  }[];
  usesRecipes: { recipeId: string }[];
  instructionGroups: {
    title: string | null;
    instructions: { text: string }[];
  }[];
}

interface Props {
  defaultRecipe?: RecipeFormInputs & { id: string };
}

export function CreateRecipePage({ defaultRecipe }: Props) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const form = useForm<RecipeFormInputs>({
    defaultValues: defaultRecipe ?? {
      name: '',
      description: '',
      prepTime: '',
      cookTime: '',
      ingredients: [],
      usesRecipes: [],
      instructionGroups: [],
    },
  });
  const { handleSubmit, control, reset } = form;
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
    fields: instructionGroups,
    append: appendInstructionGroup,
    remove: removeInstructionGroup,
  } = useFieldArray({
    control,
    name: 'instructionGroups',
  });

  const foodsQuery = useFoods();

  const foodOptions: FoodOption[] =
    foodsQuery.data?.foods.map((f) => {
      return {
        name: f.name,
        id: f.id,
      };
    }) ?? [];

  const recipesQuery = useRecipes();

  const recipeCreator = useCreateRecipe({
    mutationConfig: {
      onSuccess: (data) => {
        navigate(`/recipes/${data.recipe.id}`);
      },
    },
  });

  const recipeUpdater = useUpdateRecipe({
    mutationConfig: {
      onSuccess: (data) => {
        enqueueSnackbar('Recipe updated', { variant: 'success' });

        navigate(`/recipes/${data.recipe.id}`);
      },
    },
  });

  console.log(defaultRecipe, ingredients);

  const onSubmit: SubmitHandler<RecipeFormInputs> = (data) => {
    console.log('Create recipe:', data);

    if (defaultRecipe) {
      recipeUpdater.mutate({
        id: defaultRecipe.id,
        name: data.name,
        description: data.description || undefined,
        ingredients: data.ingredients,
        instructionGroups: data.instructionGroups.map((ig) => ({
          title: ig.title,
          instructions: ig.instructions,
        })),
      });
    } else {
      recipeCreator.mutate({
        name: data.name,
        description: data.description || undefined,
        cookTime: data.cookTime ? parseInt(data.cookTime) : undefined,
        prepTime: data.prepTime ? parseInt(data.prepTime) : undefined,
        ingredients: data.ingredients,
        instructionGroups: data.instructionGroups.map((ig) => ({
          title: ig.title,
          instructions: ig.instructions,
        })),
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
      <FormProvider {...form}>
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
                type="number"
                fullWidth
              />
              <TextFieldElement
                label="Cook time (m)"
                name="cookTime"
                control={control}
                type="number"
                fullWidth
              />
            </Stack>
          </Stack>
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
                <Stack
                  direction={'row'}
                  spacing={1}
                  key={field.id}
                  alignItems={'flex-start'}
                >
                  <TextFieldElement
                    label="Amount"
                    name={`ingredients.${index}.amount`}
                    id={`ingredients.${index}.amount`}
                    type="number"
                    control={control}
                    size="small"
                    sx={{
                      minWidth: 100,
                    }}
                  />
                  <AutocompleteElement
                    label="Unit"
                    name={`ingredients.${index}.unit`}
                    options={
                      Object.entries(unitRecord).map(([unit, unitDetail]) => ({
                        id: unit,
                        label: unitDetail.name,
                      })) ?? []
                    }
                    control={control}
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
                  <Controller
                    control={control}
                    name={`ingredients.${index}.food`}
                    rules={{
                      required: 'Required',
                    }}
                    render={({ field: { ref, onChange, ...field } }) => (
                      <Autocomplete
                        {...field}
                        freeSolo
                        fullWidth
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        autoHighlight
                        size="small"
                        options={foodOptions}
                        getOptionLabel={(option) => {
                          // Value selected with enter, right from the input
                          if (typeof option === 'string') {
                            return option;
                          }
                          // Add "xxx" option created dynamically
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          // Regular option
                          return option.name;
                        }}
                        onChange={(_event, newValue) => {
                          if (typeof newValue === 'string') {
                            onChange({
                              name: newValue,
                            });
                          } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            onChange({
                              name: newValue.inputValue,
                            });
                          } else {
                            onChange(newValue);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            appendIngredient({
                              food: {
                                name: '',
                              },
                              unit: null,
                              amount: null,
                              notes: null,
                            });

                            // run this code in 50ms
                            setTimeout(() => {
                              document
                                .getElementById(
                                  `ingredients.${index + 1}.amount`,
                                )
                                ?.focus();
                            }, 50);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            inputRef={ref}
                            required
                            label="Food"
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>{option.name}</li>
                        )}
                      />
                    )}
                  />
                  <TextFieldElement
                    label="Notes"
                    name={`ingredients.${index}.notes`}
                    control={control}
                    size="small"
                    multiline
                    sx={{
                      minWidth: 200,
                    }}
                  />
                  <IconButton
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
              appendIngredient({
                food: {
                  name: '',
                },
                unit: null,
                amount: null,
                notes: null,
              })
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
            {instructionGroups.map(
              (instructionGroup, instructionGroupIndex) => (
                <CreateInstructionGroup
                  key={instructionGroup.id}
                  index={instructionGroupIndex}
                  minimal={instructionGroups.length <= 1}
                  onRemove={() => {
                    removeInstructionGroup(instructionGroupIndex);
                  }}
                />
              ),
            )}
          </Stack>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() =>
              appendInstructionGroup({
                title: null,
                instructions: [
                  {
                    text: '',
                  },
                ],
              })
            }
            sx={{ mb: 6 }}
          >
            Add instruction group
          </Button>
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
      </FormProvider>
      <ImportRecipeDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={(importedRecipe) => {
          setImportDialogOpen(false);

          reset({
            name: importedRecipe.name,
            description: importedRecipe.description,
            instructionGroups: importedRecipe.instructionGroups?.map((ig) => ({
              title: ig.title,
              instructions: ig.instructions.map((i) => ({ text: i })),
            })),
            ingredients: importedRecipe.ingredients?.map((ingredient) => {
              if (typeof ingredient === 'string') {
                return {
                  amount: null,
                  food: {
                    name: ingredient,
                  },
                  unit: null,
                  notes: null,
                };
              } else {
                return {
                  food: {
                    name: ingredient.name,
                  },
                  unit: ingredient.unit ?? null,
                  amount: ingredient.amount ?? null,
                  notes: ingredient.notes ?? null,
                };
              }
            }),
          });
        }}
      />
    </Page>
  );
}
