import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import SpeakerNotesRoundedIcon from '@mui/icons-material/SpeakerNotesRounded';
import {
  Box,
  IconButton,
  Popover,
  Tooltip,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useState } from 'react';
import {
  TextFieldElement,
  useFormContext,
  useWatch,
} from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';

interface Props {
  sx?: SxProps<Theme>;
  ingredientIndex: number;
}

export function IngredientNotesButton({ sx = [], ingredientIndex }: Props) {
  const { control, setValue, getValues } = useFormContext<RecipeFormInputs>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ingredient = useWatch({
    control,
    name: `ingredients.${ingredientIndex}`,
    defaultValue: getValues(`ingredients.${ingredientIndex}`),
  });

  function handleClose() {
    setAnchorEl(null);

    if (ingredient.notes === '') {
      setValue(`ingredients.${ingredientIndex}.notes`, null);
    }
  }

  return (
    <Box sx={sx}>
      <Tooltip
        title={ingredient.notes ? `Notes: ${ingredient.notes}` : 'Add notes'}
      >
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          {ingredient.notes === null ? (
            <SpeakerNotesOutlinedIcon />
          ) : (
            <SpeakerNotesRoundedIcon />
          )}
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              p: 2,
            },
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <TextFieldElement
          label="Notes"
          name={`ingredients.${ingredientIndex}.notes`}
          control={control}
          size="small"
          multiline
          autoFocus
          sx={{
            minWidth: 200,
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();

              handleClose();
            }
          }}
        />
      </Popover>
    </Box>
  );
}
