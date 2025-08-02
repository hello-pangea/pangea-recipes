import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import {
  useImportRecipe,
  type ImportedRecipe,
} from '@repo/features/recipe-imports';
import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (importedRecipe: ImportedRecipe, websitePageId: string) => void;
}

export function ImportRecipeDialog({ open, onClose, onImport }: Props) {
  const [url, setUrl] = useState('');
  const importRecipe = useImportRecipe({
    mutationConfig: {
      onSuccess: (res) => {
        onImport(res.recipe, res.websitePageId);
      },
    },
  });
  const textFieldRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        textFieldRef.current?.focus();
      }, 100);
    }
  }, [open]);

  function handleImportRecipe() {
    if (importRecipe.isPending) {
      return;
    }

    if (!url) {
      return;
    }

    importRecipe.mutate({ body: { url } });
  }

  return (
    <Dialog
      disableRestoreFocus
      open={open}
      onClose={() => {
        if (!importRecipe.isPending) {
          onClose();
        }
      }}
    >
      <DialogTitle>Import recipe</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Paste the url of the recipe you want to import
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
          disabled={importRecipe.isPending}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={importRecipe.isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          loading={importRecipe.isPending}
          variant="contained"
          startIcon={<DownloadRoundedIcon />}
          onClick={() => {
            handleImportRecipe();
          }}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
