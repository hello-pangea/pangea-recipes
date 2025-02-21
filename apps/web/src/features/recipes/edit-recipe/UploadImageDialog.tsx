import { config } from '#src/config/config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';
import Uppy, { type Meta } from '@uppy/core';
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
    new Uppy<Meta, { imageId: string; imageUrl: string }>({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    })
      .use(XHR, {
        endpoint: `${config.VITE_API_URL}/images`,
        // onBeforeRequest: async (request) => {
        //   const token = await getSessionToken();

        //   if (token) {
        //     request.setRequestHeader('Authorization', `Bearer ${token}`);
        //   }
        // },
      })
      .once('complete', (res) => {
        const uploadRes = res.successful?.at(0);

        if (uploadRes?.response?.body) {
          const image = {
            id: uploadRes.response.body.imageId,
            url: uploadRes.response.body.imageUrl,
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

        uppy.clear();
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
