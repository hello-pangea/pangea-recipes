import { isSxArray } from '#src/utils/isSxArray';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

interface Props {
  sx?: SxProps<Theme>;
}

export function EmptyRecipes({ sx = [] }: Props) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        ...(isSxArray(sx) ? sx : [sx]),
      ]}
    >
      <img src="/assets/lil-guy.svg" width={64} height={64} />
      <Typography variant="h2" sx={{ mb: 2, mt: 4 }}>
        No recipes
      </Typography>
      <Typography sx={{ mb: 2, textAlign: 'center', maxWidth: 400 }}>
        Use the "New" button to create or import a recipe.
      </Typography>
    </Box>
  );
}
