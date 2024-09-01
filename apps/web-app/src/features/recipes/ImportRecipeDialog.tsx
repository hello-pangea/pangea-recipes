import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useImportedRecipe, type ImportedRecipe } from '@open-zero/features';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (importedRecipe: ImportedRecipe) => void;
}

export function ImportRecipeDialog({ open, onClose, onImport }: Props) {
  const [url, setUrl] = useState('');
  const { isLoading: isImporting, refetch: importRecipe } = useImportedRecipe({
    url,
    queryConfig: { enabled: false },
  });

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
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isImporting} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={isImporting}
          variant="contained"
          startIcon={<DownloadRoundedIcon />}
          onClick={() => {
            void importRecipe().then((res) => {
              if (res.data?.importedRecipe) {
                onImport(res.data.importedRecipe);
              }
            });
          }}
        >
          Import
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
