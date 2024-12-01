import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Autocomplete, Box, Grid2, IconButton, TextField } from '@mui/material';
import { unitRecord, units, useFoods } from '@open-zero/features';
import {
  AutocompleteElement,
  Controller,
  TextFieldElement,
  useFieldArray,
  useFormContext,
} from 'react-hook-form-mui';
import type { FoodOption, RecipeFormInputs } from './CreateRecipePage';
import { IngredientNotesButton } from './IngredientNotesButton';

interface Props {
  index: number;
}

export function NewIngredient({ index }: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const { append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: `ingredients`,
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

  return (
    <Grid2 container spacing={1}>
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
          options={units}
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
            getOptionLabel: (option) =>
              unitRecord[option].abbreviation ?? unitRecord[option].name,
            renderOption: (props, option) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const { key, ...optionProps } = props;

              return (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                <li key={key} {...optionProps}>
                  {unitRecord[option].name}
                </li>
              );
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
              handleHomeEndKeys
              autoHighlight
              autoSelect
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
              getOptionKey={(option) =>
                typeof option === 'string' ? option : (option.id ?? option.name)
              }
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
                      .getElementById(`ingredients.${index + 1}.amount`)
                      ?.focus();
                  }, 50);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={ref}
                  required
                  placeholder="Food *"
                />
              )}
              renderOption={(props, option) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const { key, ...optionProps } = props;

                return (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  <li key={key} {...optionProps}>
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
                );
              }}
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
}
