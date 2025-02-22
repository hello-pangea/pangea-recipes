import { RouterButton } from '#src/components/RouterButton';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Box, TextField, Typography } from '@mui/material';

export function ImportRecipeDemo() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: '28px',
        p: 3,
        boxShadow:
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}
    >
      <Typography variant="h2" sx={{ pb: 2 }}>
        Import recipe
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Paste the url of the recipe you want to import
      </Typography>
      <TextField
        placeholder="Recipe url"
        defaultValue={'https://example.com/autumn-soup'}
        fullWidth
        type="url"
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 3,
        }}
      >
        <RouterButton
          to="/app/sign-up"
          variant="contained"
          startIcon={<DownloadRoundedIcon />}
        >
          Import
        </RouterButton>
      </Box>
    </Box>
  );
}
