import { withForm } from '#src/hooks/form';
import type { FormPropsWrapper } from '#src/types/FormPropsWrapper';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import { Box, Button, type SxProps, type Theme } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import { recipeFormOptions } from './recipeForm';
import { UploadImageDialog } from './UploadImageDialog';

interface Props {
  sx?: SxProps<Theme>;
}

export const UploadRecipeImage = withForm({
  ...recipeFormOptions,
  props: {} as FormPropsWrapper<Props>,
  render: function Render({ form, sx }) {
    const image = useStore(form.store, (state) => state.values.image);
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
                form.setFieldValue('image', image);
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
            form.setFieldValue('image', null);
          }}
          size="small"
          color="error"
        >
          Remove image
        </Button>
      </Box>
    );
  },
});
