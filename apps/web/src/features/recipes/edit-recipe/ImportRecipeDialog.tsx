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
  useImportedRecipe,
  type ImportedRecipe,
} from '@open-zero/features/imported-recipes';
import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (importedRecipe: ImportedRecipe, websitePageId: string) => void;
}

export function ImportRecipeDialog({ open, onClose, onImport }: Props) {
  const [url, setUrl] = useState('');
  const { isFetching: isImporting, refetch: importRecipe } = useImportedRecipe({
    url,
    queryConfig: { enabled: false },
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
    void importRecipe().then((res) => {
      if (!res.data) {
        return;
      }

      onImport(res.data.importedRecipe, res.data.websitePageId);
    });
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isImporting) {
          onClose();
        }
      }}
    >
      <DialogTitle>Import recipe from url</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Paste the url of the recipe you want to import
        </Typography>
        <TextField
          label="Recipe url"
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
          disabled={isImporting}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isImporting} onClick={onClose}>
          Cancel
        </Button>
        <Button
          loading={isImporting}
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
