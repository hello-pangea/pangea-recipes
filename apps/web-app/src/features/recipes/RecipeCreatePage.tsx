import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
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
  useIngredients,
  useRecipes,
  useUnits,
  useUpdateRecipe,
} from '@open-zero/features';
import { useSnackbar } from 'notistack';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { AutocompleteElement, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { RequiredRecipeCard } from './RequiredRecipeCard';

interface NewRecipeFormInputs {
  name: string;
  description: string | null;
  prepTime?: string;
  cookTime?: string;
  ingredients: {
    ingredientId: string;
    unitId: string;
    amount: number;
    notes?: string;
  }[];
  usesRecipes: { recipeId: string }[];
  instructions: { text: string }[];
}

interface Props {
  defaultRecipe?: NewRecipeFormInputs & { id: string };
}

export function RecipeCreatePage({ defaultRecipe }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<NewRecipeFormInputs>({
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

  const ingredientsQuery = useIngredients();

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {defaultRecipe ? 'Edit recipe' : 'New recipe'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={'column'}
          spacing={2}
          sx={{ mb: 6, maxWidth: '550px', display: 'block' }}
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
                  name={`ingredients.${index}.ingredientId`}
                  label="Ingredient"
                  options={
                    ingredientsQuery.data?.ingredients.map((i) => {
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
                          ingredientId: '',
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
                  <RemoveRoundedIcon />
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
            appendIngredient({ ingredientId: '', unitId: '', amount: 0 })
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
          sx={{ mb: 2, maxWidth: '550px', display: 'block' }}
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
                  <RemoveRoundedIcon />
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
    </Box>
  );
}
