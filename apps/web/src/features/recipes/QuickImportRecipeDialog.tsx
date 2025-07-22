import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useImportRecipeQuick } from '@open-zero/features/recipe-imports';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function QuickImportRecipeDialog({ open, onClose }: Props) {
  const [url, setUrl] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const importRecipeQuick = useImportRecipeQuick({
    mutationConfig: {
      onSuccess: () => {
        enqueueSnackbar('Importing recipe... This will take a few seconds', {
          variant: 'success',
        });

        onClose();
      },
    },
  });
  const textFieldRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        textFieldRef.current?.focus();
      }, 100);
    } else {
      setUrl('');
    }
  }, [open]);

  function handleImportRecipe() {
    if (importRecipeQuick.isPending) {
      return;
    }

    if (!url) {
      return;
    }

    importRecipeQuick.mutate(url);
  }

  return (
    <Dialog
      disableRestoreFocus
      open={open}
      onClose={() => {
        if (!importRecipeQuick.isPending) {
          onClose();
        }
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Save from url</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Paste the url of a recipe you want to save. It can be from any
          website!
        </Typography>
        <TextField
          placeholder="Recipe url"
          fullWidth
          autoFocus
          type="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
          }}
          inputRef={textFieldRef}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleImportRecipe();
            }
          }}
          disabled={importRecipeQuick.isPending}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={importRecipeQuick.isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          loading={importRecipeQuick.isPending}
          variant="contained"
          startIcon={<SaveAltRoundedIcon />}
          onClick={() => {
            handleImportRecipe();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
