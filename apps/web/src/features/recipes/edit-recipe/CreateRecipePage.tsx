import { useSignedInUserId } from '#src/features/auth/useSignedInUserId';
import { focusNextInput } from '#src/lib/focusNextInput';
import { getNumberFromInput } from '#src/lib/getNumberFromInput';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { emptyStringToNull, emptyStringToUndefined } from '@open-zero/features';
import {
  useCreateRecipe,
  useRecipes,
  useUpdateRecipe,
} from '@open-zero/features/recipes';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { RequiredRecipeCard } from '../RequiredRecipeCard';
import { EditIngredientGroup } from './EditIngredientGroup';
import { EditInstructionGroup } from './EditInstructionGroup';
import { EditNutrition } from './EditNutrition';
import { ImportRecipeDialog } from './ImportRecipeDialog';
import { UploadRecipeImage } from './UploadRecipeImage';

export interface RecipeFormInputs {
  recipeName: string;
  description: string | null;
  prepTime: string;
  cookTime: string;
  servings: string;
  image: {
    id: string;
    url: string;
  } | null;
  ingredientGroups: {
    id: string | null;
    name: string | null;
    ingredients: {
      name: string;
      unit: string | null;
      quantity: number | null;
      notes: string | null;
    }[];
  }[];
  usesRecipes: { recipeId: string }[];
  instructionGroups: {
    id: string | null;
    name: string | null;
    instructions: { text: string }[];
  }[];
  websitePageId?: string;
  nutrition?: {
    calories: string | null;

    totalFatG: string | null;
    unsaturatedFatG: string | null;
    saturatedFatG: string | null;
    transFatG: string | null;

    carbsG: string | null;
    proteinG: string | null;
    fiberG: string | null;
    sugarG: string | null;

    sodiumMg: string | null;
    ironMg: string | null;
    calciumMg: string | null;
    potassiumMg: string | null;
    cholesterolMg: string | null;
  };
}

interface Props {
  defaultRecipe?: RecipeFormInputs & { id: string };
}

export function CreateRecipePage({ defaultRecipe }: Props) {
  const { importFromUrl } = useSearch({ strict: false });
  const [importDialogOpen, setImportDialogOpen] = useState(
    importFromUrl ?? false,
  );
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const form = useForm<RecipeFormInputs>({
    defaultValues: defaultRecipe ?? {
      recipeName: '',
      description: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      image: null,
      ingredientGroups: [
        {
          id: null,
          name: null,
          ingredients: [
            {
              name: '',
              unit: null,
              quantity: null,
              notes: null,
            },
            {
              name: '',
              unit: null,
              quantity: null,
              notes: null,
            },
            {
              name: '',
              unit: null,
              quantity: null,
              notes: null,
            },
          ],
        },
      ],
      usesRecipes: [],
      instructionGroups: [
        {
          id: null,
          name: null,
          instructions: [
            {
              text: '',
            },
            {
              text: '',
            },
            {
              text: '',
            },
          ],
        },
      ],
    },
  });
  const userId = useSignedInUserId();
  const { handleSubmit, control, reset } = form;
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
  const {
    fields: ingredientGroups,
    append: appendIngredientGroup,
    remove: removeIngredientGroup,
  } = useFieldArray({
    control,
    name: 'ingredientGroups',
  });

  const { data: recipes } = useRecipes({
    options: {
      userId: userId,
    },
  });

  const createRecipe = useCreateRecipe({
    mutationConfig: {
      onSuccess: (newRecipe) => {
        void navigate({
          to: `/app/recipes/$recipeId`,
          params: {
            recipeId: newRecipe.id,
          },
        });
      },
    },
  });

  const updateRecipe = useUpdateRecipe({
    mutationConfig: {
      onSuccess: (data) => {
        enqueueSnackbar('Recipe updated', { variant: 'success' });

        void navigate({
          to: `/app/recipes/$recipeId`,
          params: {
            recipeId: data.recipe.id,
          },
        });
      },
    },
  });

  const onSubmit: SubmitHandler<RecipeFormInputs> = (data) => {
    if (defaultRecipe) {
      updateRecipe.mutate({
        id: defaultRecipe.id,
        name: data.recipeName,
        description: emptyStringToNull(data.description),
        prepTime: data.prepTime
          ? Math.round(parseInt(data.prepTime) * 60)
          : null,
        cookTime: data.cookTime
          ? Math.round(parseInt(data.cookTime) * 60)
          : null,
        servings: data.servings ? parseInt(data.servings) : null,
        ingredientGroups: data.ingredientGroups.map((ig) => ({
          id: ig.id ?? undefined,
          name: ig.name,
          ingredients: ig.ingredients.map((i) => ({
            ...i,
            quantity: i.quantity ? getNumberFromInput(i.quantity) : null,
          })),
        })),
        instructionGroups: data.instructionGroups.map((ig) => ({
          id: ig.id ?? undefined,
          name: ig.name,
          instructions: ig.instructions,
        })),
        imageIds: data.image ? [data.image.id] : null,
        nutrition: data.nutrition
          ? {
              calories: getNumberFromInput(data.nutrition.calories),

              totalFatG: getNumberFromInput(data.nutrition.totalFatG),
              unsaturatedFatG: getNumberFromInput(
                data.nutrition.unsaturatedFatG,
              ),
              saturatedFatG: getNumberFromInput(data.nutrition.saturatedFatG),
              transFatG: getNumberFromInput(data.nutrition.transFatG),

              carbsG: getNumberFromInput(data.nutrition.carbsG),
              proteinG: getNumberFromInput(data.nutrition.proteinG),
              fiberG: getNumberFromInput(data.nutrition.fiberG),
              sugarG: getNumberFromInput(data.nutrition.sugarG),

              sodiumMg: getNumberFromInput(data.nutrition.sodiumMg),
              ironMg: getNumberFromInput(data.nutrition.ironMg),
              calciumMg: getNumberFromInput(data.nutrition.calciumMg),
              potassiumMg: getNumberFromInput(data.nutrition.potassiumMg),
              cholesterolMg: getNumberFromInput(data.nutrition.cholesterolMg),
            }
          : undefined,
      });
    } else {
      createRecipe.mutate({
        name: data.recipeName,
        description: emptyStringToUndefined(data.description),
        websitePageId: data.websitePageId,
        prepTime: data.prepTime
          ? Math.round(parseInt(data.prepTime) * 60)
          : undefined,
        cookTime: data.cookTime
          ? Math.round(parseInt(data.cookTime) * 60)
          : undefined,
        servings: data.servings ? parseInt(data.servings) : undefined,
        imageIds: data.image ? [data.image.id] : undefined,
        ingredientGroups: data.ingredientGroups.map((ig) => ({
          name: ig.name,
          ingredients: ig.ingredients.map((i) => ({
            ...i,
            quantity: i.quantity ? getNumberFromInput(i.quantity) : null,
          })),
        })),
        instructionGroups: data.instructionGroups.map((ig) => ({
          name: ig.name,
          instructions: ig.instructions,
        })),
        nutrition: data.nutrition
          ? {
              calories: getNumberFromInput(data.nutrition.calories),

              totalFatG: getNumberFromInput(data.nutrition.totalFatG),
              unsaturatedFatG: getNumberFromInput(
                data.nutrition.unsaturatedFatG,
              ),
              saturatedFatG: getNumberFromInput(data.nutrition.saturatedFatG),
              transFatG: getNumberFromInput(data.nutrition.transFatG),

              carbsG: getNumberFromInput(data.nutrition.carbsG),
              proteinG: getNumberFromInput(data.nutrition.proteinG),
              fiberG: getNumberFromInput(data.nutrition.fiberG),
              sugarG: getNumberFromInput(data.nutrition.sugarG),

              sodiumMg: getNumberFromInput(data.nutrition.sodiumMg),
              ironMg: getNumberFromInput(data.nutrition.ironMg),
              calciumMg: getNumberFromInput(data.nutrition.calciumMg),
              potassiumMg: getNumberFromInput(data.nutrition.potassiumMg),
              cholesterolMg: getNumberFromInput(data.nutrition.cholesterolMg),
            }
          : undefined,
      });
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        pb: 4,
        width: '100%',
      }}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 8,
              maxWidth: 750,
              backgroundColor: (theme) => theme.palette.background.paper,
              zIndex: 11,
              px: 2,
              py: 1.5,
              borderRadius: 1.5,
              boxShadow:
                '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            }}
          >
            <Typography variant="h1">
              {defaultRecipe ? 'Edit recipe' : 'New recipe'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              type="submit"
              loading={createRecipe.isPending || updateRecipe.isPending}
              sx={{
                display: 'flex',
              }}
            >
              Save
            </Button>
          </Box>
          <Button
            size="small"
            startIcon={<LinkRoundedIcon />}
            onClick={() => {
              setImportDialogOpen(true);
            }}
            sx={{
              mb: 2,
              mt: 2,
            }}
          >
            Import from url
          </Button>
          <Grid
            container
            spacing={3}
            sx={{
              mb: 2,
              maxWidth: '750px',
            }}
          >
            <Grid size={{ xs: 12 }}>
              <TextFieldElement
                label="Recipe name"
                name="recipeName"
                control={control}
                fullWidth
                multiline
                required
                onKeyDown={(event) => {
                  focusNextInput(event, 'textarea[name="description"]');
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextFieldElement
                label="Description"
                name="description"
                control={control}
                multiline
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextFieldElement
                label="Servings"
                name="servings"
                control={control}
                type="number"
                fullWidth
                size="small"
                onKeyDown={(event) => {
                  focusNextInput(event, 'input[name="prepTime"]');
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextFieldElement
                label="Prep time"
                name="prepTime"
                control={control}
                type="number"
                fullWidth
                size="small"
                onKeyDown={(event) => {
                  focusNextInput(event, 'input[name="cookTime"]');
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">minutes</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextFieldElement
                label="Cook time"
                name="cookTime"
                control={control}
                type="number"
                fullWidth
                size="small"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">minutes</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
          <UploadRecipeImage sx={{ mb: 6 }} />
          <Typography variant="h2" sx={{ mb: 2 }}>
            Ingredients
          </Typography>
          <Stack
            direction={'column'}
            spacing={2}
            sx={{ mb: 2, maxWidth: '750px' }}
          >
            {ingredientGroups.map((ingredientGroup, ingredientGroupIndex) => (
              <EditIngredientGroup
                key={ingredientGroup.id}
                index={ingredientGroupIndex}
                minimal={ingredientGroups.length <= 1}
                onRemove={() => {
                  removeIngredientGroup(ingredientGroupIndex);
                }}
              />
            ))}
          </Stack>
          <Button
            variant="text"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              appendIngredientGroup({
                id: null,
                name: null,
                ingredients: [
                  {
                    name: '',
                    unit: null,
                    quantity: null,
                    notes: null,
                  },
                ],
              });
            }}
            sx={{ mb: 6 }}
          >
            Add ingredient group
          </Button>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Instructions
          </Typography>
          <Stack
            direction={'column'}
            spacing={2}
            sx={{ mb: 2, maxWidth: '750px' }}
          >
            {instructionGroups.map(
              (instructionGroup, instructionGroupIndex) => (
                <EditInstructionGroup
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
            variant="text"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              appendInstructionGroup({
                id: null,
                name: null,
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
          <EditNutrition sx={{ mb: 6, maxWidth: 750 }} />
          <Typography variant="h2" sx={{ mb: 2 }}>
            Required recipes
          </Typography>
          {usesRecipes.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {usesRecipes.map((usesRecipe, index) => (
                <Grid
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
                </Grid>
              ))}
            </Grid>
          )}
          <Autocomplete
            options={
              recipes?.map((r) => {
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
        </form>
      </FormProvider>
      <ImportRecipeDialog
        open={importDialogOpen}
        onClose={() => {
          setImportDialogOpen(false);

          void navigate({
            to: '.',
            search: (prev) => ({
              ...prev,
              importFromUrl: undefined,
            }),
          });
        }}
        onImport={(importedRecipe, websitePageId) => {
          setImportDialogOpen(false);

          void navigate({
            to: '.',
            search: (prev) => ({
              ...prev,
              importFromUrl: undefined,
            }),
          });

          reset({
            recipeName: importedRecipe.name ?? undefined,
            description: importedRecipe.description,
            cookTime: importedRecipe.cookTime?.toString(),
            prepTime: importedRecipe.prepTime?.toString(),
            servings: importedRecipe.servings?.toString(),
            instructionGroups: importedRecipe.instructionGroups?.map((ig) => ({
              name: ig.title,
              instructions: ig.instructions.map((i) => ({ text: i })),
            })),
            websitePageId,
            ingredientGroups: importedRecipe.ingredientGroups?.map((ig) => ({
              name: ig.title,
              ingredients: ig.ingredients.map((ingredient) => ({
                name: ingredient.name,
                unit: ingredient.unit ?? null,
                quantity: ingredient.quantity ?? null,
                notes: ingredient.notes ?? null,
              })),
            })),
            nutrition: importedRecipe.nutrition
              ? {
                  calories: importedRecipe.nutrition.calories?.toString(),
                  totalFatG: importedRecipe.nutrition.totalFatG?.toString(),
                  unsaturatedFatG:
                    importedRecipe.nutrition.unsaturatedFatG?.toString(),
                  saturatedFatG:
                    importedRecipe.nutrition.saturatedFatG?.toString(),
                  transFatG: importedRecipe.nutrition.transFatG?.toString(),
                  carbsG: importedRecipe.nutrition.carbsG?.toString(),
                  proteinG: importedRecipe.nutrition.proteinG?.toString(),
                  fiberG: importedRecipe.nutrition.fiberG?.toString(),
                  sugarG: importedRecipe.nutrition.sugarG?.toString(),
                  sodiumMg: importedRecipe.nutrition.sodiumMg?.toString(),
                  ironMg: importedRecipe.nutrition.ironMg?.toString(),
                  calciumMg: importedRecipe.nutrition.calciumMg?.toString(),
                  potassiumMg: importedRecipe.nutrition.potassiumMg?.toString(),
                  cholesterolMg:
                    importedRecipe.nutrition.cholesterolMg?.toString(),
                }
              : undefined,
          });
        }}
      />
    </Box>
  );
}
