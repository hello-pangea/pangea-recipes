import { Box, Button, type SxProps, type Theme } from '@mui/material';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';
import { UploadImageDialog } from './UploadImageDialog';

interface Props {
  sx?: SxProps<Theme>;
}

export function CreateRecipeImage({ sx = [] }: Props) {
  const { control, setValue, getValues } = useFormContext<RecipeFormInputs>();
  const image = useWatch({
    control,
    name: 'image',
    defaultValue: getValues('image'),
  });
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);

  if (!image) {
    return (
      <Box sx={sx}>
        <Button
          onClick={() => {
            setUploadImageDialogOpen(true);
          }}
        >
          Upload image
        </Button>
        <UploadImageDialog
          open={uploadImageDialogOpen}
          onClose={(image) => {
            setUploadImageDialogOpen(false);

            if (image) {
              setValue('image', image);
            }
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <img
        alt="Recipe"
        src={image.url}
        height={200}
        style={{
          borderRadius: '12px',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <Button
        onClick={() => {
          setValue('image', null);
        }}
        size="small"
        color="error"
      >
        Remove image
      </Button>
    </Box>
  );
}
