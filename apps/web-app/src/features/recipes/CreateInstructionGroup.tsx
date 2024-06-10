import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Button, Card, IconButton, Stack, Typography } from '@mui/material';
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

export function CreateInstructionGroup({
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
            mb: 2,
          }}
        >
          <TextFieldElement
            name={`instructionGroups.${instructionGroupIndex}.title`}
            label="Title"
            control={control}
            required
            fullWidth
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
            <Typography
              component={'p'}
              variant="h1"
              sx={{
                width: 50,
                color: (theme) => theme.palette.text.secondary,
              }}
            >
              {instructionIndex + 1}.
            </Typography>
            <TextFieldElement
              name={`instructionGroups.${instructionGroupIndex}.instructions.${instructionIndex}.text`}
              placeholder="Add the secret ingredient!"
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
        onClick={() => appendInstruction({ text: '' })}
        sx={{ ml: '58px' }}
      >
        Add instruction
      </Button>
    </Card>
  );
}
