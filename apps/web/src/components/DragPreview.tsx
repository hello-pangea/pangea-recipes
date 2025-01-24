import { Box, Typography } from '@mui/material';

interface Props {
  text: string;
  icon?: React.ReactNode;
  errorText?: string;
}

export function DragPreview({ text, icon, errorText }: Props) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: '8px',
        backgroundColor: (theme) => theme.palette.background.paper,
        display: 'inline-block',
        px: 1,
        py: 0.5,
        // Max height and width for native drag previews
        // Windows will do goofy stuff if drag preview are any bigger than these dimensions
        // https://atlassian.design/components/pragmatic-drag-and-drop/web-platform-design-constraints#native-drag-previews
        maxWidth: '280px',
        maxHeight: '280px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            ml: icon ? 1 : 0,
          }}
        >
          {text}
        </Typography>
      </Box>
      {errorText && (
        <Typography
          sx={{
            color: (theme) => theme.palette.error.main,
            fontSize: '0.75rem',
            mt: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {errorText}
        </Typography>
      )}
    </Box>
  );
}
