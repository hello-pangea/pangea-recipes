import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Button, Card, IconButton, Stack } from '@mui/material';
import {
  TextFieldElement,
  useFieldArray,
  useFormContext,
} from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';
import { NewIngredient } from './NewIngredient';

interface Props {
  index: number;
  minimal?: boolean;
  onRemove: () => void;
}

export function CreateIngredientGroup({
  index: ingredientGroupIndex,
  minimal,
  onRemove,
}: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const {
    fields: ingredients,
    append: appendIngredient,
    // remove: removeIngredient,
  } = useFieldArray({
    control,
    name: `ingredientGroups.${ingredientGroupIndex}.ingredients`,
  });

  return (
    <Card sx={{ p: 2 }}>
      {!minimal && (
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={2}
          sx={{
            mb: 4,
          }}
        >
          <TextFieldElement
            name={`ingredientGroups.${ingredientGroupIndex}.name`}
            label="Title"
            placeholder="ex. Cake, Frosting"
            control={control}
            required
            fullWidth
            variant="filled"
          />
          <IconButton onClick={onRemove}>
            <DeleteRoundedIcon />
          </IconButton>
        </Stack>
      )}
      <Stack direction={'column'} spacing={2} sx={{ mb: 2, maxWidth: '750px' }}>
        {ingredients.map((ingredient, ingredientIndex) => (
          <NewIngredient
            ingredientGroupIndex={ingredientGroupIndex}
            index={ingredientIndex}
            key={ingredient.id}
          />
        ))}
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
      >
        Add ingredient
      </Button>
    </Card>
  );
}
