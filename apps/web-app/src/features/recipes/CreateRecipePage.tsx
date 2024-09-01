import { ButtonLink } from '#src/components/ButtonLink';
import { Page } from '#src/components/Page';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Grid2,
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
import { useNavigate } from '@tanstack/react-router';
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
import { useAuthRequired } from '../auth/useAuth';
import { CreateInstructionGroup } from './CreateInstructionGroup';
import { ImportRecipeDialog } from './ImportRecipeDialog';
import { IngredientNotesButton } from './IngredientNotesButton';
import { RequiredRecipeCard } from './RequiredRecipeCard';
import { UploadRecipeImage } from './UploadRecipeImage';

interface FoodOption {
  inputValue?: string;
  name: string;
  id?: string;
  iconUrl?: string;
}

export interface RecipeFormInputs {
  name: string;
  description: string | null;
  prepTime: string;
  cookTime: string;
  image: {
    id: string;
    url: string;
  } | null;
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
      image: null,
      ingredients: [],
      usesRecipes: [],
      instructionGroups: [],
    },
  });
  const { user } = useAuthRequired();
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
        iconUrl: f.icon?.url,
      };
    }) ?? [];

  const recipesQuery = useRecipes({
    options: {
      userId: user.id,
    },
  });

  const recipeCreator = useCreateRecipe({
    mutationConfig: {
      onSuccess: (data) => {
        void navigate({
          to: `/recipes/$recipeId`,
          params: {
            recipeId: data.recipe.id,
          },
        });
      },
    },
  });

  const recipeUpdater = useUpdateRecipe({
    mutationConfig: {
      onSuccess: (data) => {
        enqueueSnackbar('Recipe updated', { variant: 'success' });

        void navigate({
          to: `/recipes/$recipeId`,
          params: {
            recipeId: data.recipe.id,
          },
        });
      },
    },
  });

  const onSubmit: SubmitHandler<RecipeFormInputs> = (data) => {
    if (defaultRecipe) {
      recipeUpdater.mutate({
        id: defaultRecipe.id,
        name: data.name,
        description: data.description ?? undefined,
        ingredients: data.ingredients,
        instructionGroups: data.instructionGroups.map((ig) => ({
          title: ig.title,
          instructions: ig.instructions,
        })),
      });
    } else {
      recipeCreator.mutate({
        name: data.name,
        description: data.description ?? undefined,
        cookTime: data.cookTime ? parseInt(data.cookTime) : undefined,
        prepTime: data.prepTime ? parseInt(data.prepTime) : undefined,
        imageIds: data.image ? [data.image.id] : undefined,
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
      <ButtonLink
        size="small"
        startIcon={<ChevronLeftRoundedIcon />}
        color="inherit"
        to="/recipes"
      >
        Back
      </ButtonLink>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1">
          {defaultRecipe ? 'Edit recipe' : 'New recipe'}
        </Typography>
        {/* <Button
          size="small"
          startIcon={<LinkRoundedIcon />}
          onClick={() => setImportDialogOpen(true)}
        >
          Import from url
        </Button> */}
      </Box>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction={'column'}
            spacing={2}
            sx={{ mb: 2, maxWidth: '750px', display: 'block' }}
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
                size="small"
              />
              <TextFieldElement
                label="Cook time (m)"
                name="cookTime"
                control={control}
                type="number"
                fullWidth
                size="small"
              />
            </Stack>
          </Stack>
          <UploadRecipeImage sx={{ mb: 6 }} />
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
                <Grid2 container key={field.id} spacing={1}>
                  <Grid2
                    size={{
                      xs: 6,
                      sm: 'auto',
                    }}
                  >
                    <TextFieldElement
                      placeholder="Amount"
                      name={`ingredients.${index}.amount`}
                      id={`ingredients.${index}.amount`}
                      inputMode="decimal"
                      control={control}
                      size="small"
                      fullWidth
                      sx={{
                        width: { xs: undefined, sm: 115 },
                      }}
                    />
                  </Grid2>
                  <Grid2
                    size={{
                      xs: 6,
                      sm: 'auto',
                    }}
                  >
                    <AutocompleteElement
                      name={`ingredients.${index}.unit`}
                      options={Object.entries(unitRecord).map(
                        ([unit, unitDetail]) => ({
                          id: unit,
                          label: unitDetail.abbreviation ?? unitDetail.name,
                        }),
                      )}
                      control={control}
                      matchId
                      autocompleteProps={{
                        fullWidth: true,
                        size: 'small',
                        autoHighlight: true,
                        disableClearable: true,
                        sx: {
                          width: { xs: undefined, sm: 115 },
                        },
                      }}
                      textFieldProps={{
                        placeholder: 'Unit',
                      }}
                    />
                  </Grid2>
                  <Grid2
                    size={{
                      xs: 'grow',
                    }}
                  >
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
                            } else if (newValue?.inputValue) {
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
                              placeholder="Food*"
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props}>
                              {option.iconUrl ? (
                                <img
                                  width={16}
                                  height={16}
                                  src={option.iconUrl}
                                  style={{ marginRight: 8 }}
                                />
                              ) : (
                                <Box sx={{ width: 16, mr: 1 }} />
                              )}
                              {option.name}
                            </li>
                          )}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2
                    size={{
                      xs: 'auto',
                    }}
                    display="flex"
                    alignItems="center"
                  >
                    <IngredientNotesButton ingredientIndex={index} />
                    <IconButton
                      onClick={() => {
                        removeIngredient(index);
                      }}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Grid2>
                </Grid2>
              );
            })}
          </Stack>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              appendIngredient({
                food: {
                  name: '',
                },
                unit: null,
                amount: null,
                notes: null,
              });
            }}
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
            onClick={() => {
              appendInstructionGroup({
                title: null,
                instructions: [
                  {
                    text: '',
                  },
                ],
              });
            }}
            sx={{ mb: 6 }}
          >
            Add instruction group
          </Button>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Required recipes
          </Typography>
          {usesRecipes.length > 0 && (
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
              {usesRecipes.map((usesRecipe, index) => (
                <Grid2
                  key={usesRecipe.recipeId}
                  size={{
                    xs: 12,
                    md: 4,
                    lg: 3,
                  }}
                >
                  <RequiredRecipeCard
                    recipeId={usesRecipe.recipeId}
                    onRemove={() => {
                      removeRecipe(index);
                    }}
                  />
                </Grid2>
              ))}
            </Grid2>
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
        onClose={() => {
          setImportDialogOpen(false);
        }}
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
