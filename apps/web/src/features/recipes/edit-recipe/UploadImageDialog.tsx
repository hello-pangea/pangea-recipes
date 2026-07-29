import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material';
import Uppy, { type Meta } from '@uppy/core';
import Dashboard from '@uppy/react/dashboard';
import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';
import XHR from '@uppy/xhr-upload';
import { useState } from 'react';
import { toast } from 'sonner';
import { config } from '#src/config/config';

interface Props {
  open: boolean;
  onClose: (image?: { id: string; url: string }) => void;
}

export function UploadImageDialog({ open, onClose }: Props) {
  const [uppy] = useState(() =>
    new Uppy<Meta, { imageId: string; imageUrl: string }>({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    })
      .use(XHR, {
        endpoint: `${config.VITE_API_URL}/images`,
        withCredentials: true,
      })
      .once('complete', (res) => {
        const uploadRes = res.successful?.at(0);

        if (uploadRes?.response?.body) {
          const image = {
            id: uploadRes.response.body.imageId,
            url: uploadRes.response.body.imageUrl,
          };

          onClose(image);

          toast.success('Uploaded image');
        } else {
          onClose();

          toast.error('Error uploading image');
        }

        // oxlint-disable-next-line react/react-compiler
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
