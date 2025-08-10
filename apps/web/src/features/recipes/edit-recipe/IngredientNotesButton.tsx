import { withForm } from '#src/hooks/form';
import type { FormPropsWrapper } from '#src/types/FormPropsWrapper';
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
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import { recipeFormOptions } from './recipeForm';

interface Props {
  sx?: SxProps<Theme>;
  ingredientGroupIndex: number;
  ingredientIndex: number;
}

export const IngredientNotesButton = withForm({
  ...recipeFormOptions,
  props: {} as FormPropsWrapper<Props>,
  render: function Render({
    form,
    sx = [],
    ingredientGroupIndex,
    ingredientIndex,
  }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const ingredient = useStore(form.store, (state) =>
      state.values.ingredientGroups
        .at(ingredientGroupIndex)
        ?.ingredients.at(ingredientIndex),
    );

    function handleClose() {
      setAnchorEl(null);

      if (ingredient?.notes === '') {
        form.setFieldValue(
          `ingredientGroups[${ingredientGroupIndex}].ingredients[${ingredientIndex}].notes`,
          null,
        );
      }
    }

    return (
      <Box sx={sx}>
        <Tooltip
          title={ingredient?.notes ? ingredient.notes : 'Add notes'}
          disableInteractive
        >
          <IconButton
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            color={ingredient?.notes ? 'primary' : 'default'}
          >
            {ingredient?.notes === null ? (
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
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <form.AppField
            name={`ingredientGroups[${ingredientGroupIndex}].ingredients[${ingredientIndex}].notes`}
            children={(field) => (
              <field.TextField
                placeholder="Notes"
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
            )}
          />
        </Popover>
      </Box>
    );
  },
});
