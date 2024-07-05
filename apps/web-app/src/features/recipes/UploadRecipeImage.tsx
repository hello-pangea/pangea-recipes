import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import { Box, Button, type SxProps, type Theme } from '@mui/material';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form-mui';
import type { RecipeFormInputs } from './CreateRecipePage';
import { UploadImageDialog } from './UploadImageDialog';

interface Props {
  sx?: SxProps<Theme>;
}

export function UploadRecipeImage({ sx = [] }: Props) {
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
        <Box
          sx={{
            width: 200,
            height: 100,
            borderRadius: 1,
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Button
            startIcon={<UploadRoundedIcon />}
            onClick={() => {
              setUploadImageDialogOpen(true);
            }}
          >
            Upload image
          </Button>
        </Box>
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
