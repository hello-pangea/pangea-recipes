import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Box, Button, Card, FormLabel, IconButton, Stack } from '@mui/material';
import {
  TextFieldElement,
  useFieldArray,
  useFormContext,
} from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';

interface Props {
  index: number;
  minimal?: boolean;
  onRemove: () => void;
}

export function EditInstructionGroup({
  index: instructionGroupIndex,
  minimal,
  onRemove,
}: Props) {
  const { control } = useFormContext<RecipeFormInputs>();
  const {
    fields: instructions,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: `instructionGroups.${instructionGroupIndex}.instructions`,
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
            name={`instructionGroups.${instructionGroupIndex}.name`}
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
      <Stack direction={'column'} spacing={3} sx={{ mb: 2, maxWidth: '750px' }}>
        {instructions.map((instruction, instructionIndex) => (
          <Stack
            direction={'row'}
            alignItems={'flex-start'}
            spacing={1}
            key={instruction.id}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <FormLabel
                  htmlFor={`instructionGroups.${instructionGroupIndex}.instructions.${instructionIndex}.text`}
                >
                  Step {instructionIndex + 1}
                </FormLabel>
                <IconButton
                  onClick={() => {
                    removeInstruction(instructionIndex);
                  }}
                  size="small"
                >
                  <DeleteRoundedIcon fontSize="inherit" />
                </IconButton>
              </Box>
              <TextFieldElement
                id={`instructionGroups.${instructionGroupIndex}.instructions.${instructionIndex}.text`}
                name={`instructionGroups.${instructionGroupIndex}.instructions.${instructionIndex}.text`}
                control={control}
                multiline
                required
                fullWidth
                minRows={2}
              />
            </Box>
          </Stack>
        ))}
      </Stack>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddRoundedIcon />}
        onClick={() => {
          appendInstruction({ text: '' });
        }}
      >
        Add step
      </Button>
    </Card>
  );
}
