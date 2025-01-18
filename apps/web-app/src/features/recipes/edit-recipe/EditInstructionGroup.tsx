import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Button, Card, IconButton, Stack } from '@mui/material';
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
      <Stack direction={'column'} spacing={2} sx={{ mb: 2, maxWidth: '750px' }}>
        {instructions.map((instruction, instructionIndex) => (
          <Stack
            direction={'row'}
            alignItems={'flex-start'}
            spacing={2}
            key={instruction.id}
          >
            <TextFieldElement
              name={`instructionGroups.${instructionGroupIndex}.instructions.${instructionIndex}.text`}
              placeholder="Add the secret ingredient!"
              label={`Step ${instructionIndex + 1}`}
              required
              control={control}
              size="small"
              fullWidth
              multiline
              minRows={2}
            />
            <IconButton
              onClick={() => {
                removeInstruction(instructionIndex);
              }}
            >
              <DeleteRoundedIcon />
            </IconButton>
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
