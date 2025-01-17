import { Page } from '#src/components/Page';
import { RouterButton } from '#src/components/RouterButton';
import { useSignedInUserId } from '#src/features/auth/useSignedInUserId';
import { focusNextInput } from '#src/lib/focusNextInput';
import { getNumberFromInput } from '#src/lib/getNumberFromInput';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Autocomplete,
  Box,
  Button,
  Grid2,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { emptyStringToUndefined } from '@open-zero/features';
import {
  useCreateRecipe,
  useRecipes,
  useUpdateRecipe,
} from '@open-zero/features/recipes';
import type { Unit } from '@open-zero/features/units';
import { useNavigate } from '@tanstack/react-router';
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
import { CreateIngredientGroup } from './CreateIngredientGroup';
import { CreateInstructionGroup } from './CreateInstructionGroup';
import { ImportRecipeDialog } from './ImportRecipeDialog';
import { UploadRecipeImage } from './UploadRecipeImage';

export interface RecipeFormInputs {
  name: string;
  description: string | null;
  prepTime: string;
  cookTime: string;
  image: {
    id: string;
    url: string;
  } | null;
  ingredientGroups: {
    id: string | null;
    name: string | null;
    ingredients: {
      name: string;
      unit: Unit | null;
      amount: number | null;
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
      ingredientGroups: [],
      usesRecipes: [],
      instructionGroups: [],
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

  const recipeCreator = useCreateRecipe({
    mutationConfig: {
      onSuccess: (data) => {
        void navigate({
          to: `/app/recipes/$recipeId`,
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
      recipeUpdater.mutate({
        id: defaultRecipe.id,
        name: data.name,
        description: emptyStringToUndefined(data.description),
        prepTime: data.prepTime
          ? Math.round(parseInt(data.prepTime) * 60)
          : undefined,
        cookTime: data.cookTime
          ? Math.round(parseInt(data.cookTime) * 60)
          : undefined,
        ingredientGroups: data.ingredientGroups.map((ig) => ({
          id: ig.id ?? undefined,
          name: ig.name,
          ingredients: ig.ingredients.map((i) => ({
            ...i,
            amount: i.amount ? getNumberFromInput(i.amount) : null,
          })),
        })),
        instructionGroups: data.instructionGroups.map((ig) => ({
          id: ig.id ?? undefined,
          name: ig.name,
          instructions: ig.instructions,
        })),
      });
    } else {
      recipeCreator.mutate({
        name: data.name,
        description: emptyStringToUndefined(data.description),
        websitePageId: data.websitePageId,
        prepTime: data.cookTime
          ? Math.round(parseInt(data.prepTime) * 60)
          : undefined,
        cookTime: data.prepTime
          ? Math.round(parseInt(data.cookTime) * 60)
          : undefined,
        imageIds: data.image ? [data.image.id] : undefined,
        ingredientGroups: data.ingredientGroups.map((ig) => ({
          name: ig.name,
          ingredients: ig.ingredients.map((i) => ({
            ...i,
            amount: i.amount ? getNumberFromInput(i.amount) : null,
          })),
        })),
        instructionGroups: data.instructionGroups.map((ig) => ({
          name: ig.name,
          instructions: ig.instructions,
        })),
      });
    }
  };

  return (
    <Page>
      <RouterButton
        size="small"
        startIcon={<ChevronLeftRoundedIcon />}
        color="inherit"
        to="/app/recipes"
      >
        Back
      </RouterButton>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1">
          {defaultRecipe ? 'Edit recipe' : 'New recipe'}
        </Typography>
        <Button
          size="small"
          startIcon={<LinkRoundedIcon />}
          onClick={() => {
            setImportDialogOpen(true);
          }}
        >
          Import from url
        </Button>
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
              onKeyDown={(event) => {
                focusNextInput(event, 'textarea[name="description"]');
              }}
            />
            <TextFieldElement
              label="Description"
              name="description"
              control={control}
              fullWidth
              multiline
              minRows={2}
              onKeyDown={(event) => {
                focusNextInput(event, 'input[name="prepTime"]');
              }}
            />
            <Stack direction={'row'} spacing={2}>
              <TextFieldElement
                label="Prep time (m)"
                name="prepTime"
                control={control}
                type="number"
                fullWidth
                size="small"
                onKeyDown={(event) => {
                  focusNextInput(event, 'input[name="cookTime"]');
                }}
              />
              <TextFieldElement
                label="Cook time (m)"
                name="cookTime"
                control={control}
                type="number"
                fullWidth
                size="small"
                onKeyDown={(event) => {
                  event.preventDefault();
                }}
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
            {ingredientGroups.map((ingredientGroup, ingredientGroupIndex) => (
              <CreateIngredientGroup
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
                    amount: null,
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
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            type="submit"
            loading={recipeCreator.isPending || recipeUpdater.isPending}
            sx={{
              display: 'flex',
            }}
          >
            Save
          </Button>
        </form>
      </FormProvider>
      <ImportRecipeDialog
        open={importDialogOpen}
        onClose={() => {
          setImportDialogOpen(false);
        }}
        onImport={(importedRecipe, websitePageId) => {
          setImportDialogOpen(false);

          reset({
            name: importedRecipe.name ?? undefined,
            description: importedRecipe.description,
            cookTime: importedRecipe.cookTime?.toString(),
            prepTime: importedRecipe.prepTime?.toString(),
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
                amount: ingredient.amount ?? null,
                notes: ingredient.notes ?? null,
              })),
            })),
          });
        }}
      />
    </Page>
  );
}
