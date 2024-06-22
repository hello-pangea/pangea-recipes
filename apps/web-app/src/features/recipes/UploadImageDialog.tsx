import { config } from '#src/config/config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: (image?: { id: string; url: string }) => void;
}

export function UploadImageDialog({ open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    })
      .use(XHR, { endpoint: `${config.VITE_API_URL}/images` })
      .once('complete', (res) => {
        uppy.cancelAll();

        const uploadRes = res.successful.at(0);

        if (uploadRes?.response) {
          const image = {
            id: uploadRes.response.body['image_id'] as string,
            url: uploadRes.response.body['image_url'] as string,
          };

          onClose(image);

          enqueueSnackbar('Uploaded image', {
            variant: 'success',
          });
        } else {
          onClose();

          enqueueSnackbar('Error uploading image', {
            variant: 'error',
          });
        }
      }),
  );

  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <DialogTitle>Upload image</DialogTitle>
      <DialogContent>
        <Dashboard
          uppy={uppy}
          proudlyDisplayPoweredByUppy={false}
          showLinkToFileUploadResult={false}
          height={'300px'}
          theme={theme.palette.mode}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
