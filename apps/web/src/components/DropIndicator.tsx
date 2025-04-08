import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type Orientation = 'horizontal' | 'vertical';

const edgeToOrientationMap: Record<Edge, Orientation> = {
  top: 'horizontal',
  bottom: 'horizontal',
  left: 'vertical',
  right: 'vertical',
};

const strokeSize = 2;
const terminalSize = 8;

export function DropIndicator({
  edge,
  gap,
  insetValue = 4,
}: {
  edge: Edge;
  gap: string;
  insetValue?: number;
}) {
  const theme = useTheme();
  const lineOffset = `calc(-0.5 * (${gap} + ${strokeSize}px))`;

  const orientation = edgeToOrientationMap[edge];

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: theme.vars.palette.primary.main,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(orientation === 'horizontal'
          ? {
              height: `${strokeSize}px`,
              left: `${terminalSize / 2}px`,
              right: 0,
              top: edge === 'top' ? lineOffset : undefined,
              bottom: edge === 'bottom' ? lineOffset : undefined,
            }
          : {
              width: `${strokeSize}px`,
              top: `${terminalSize / 2}px`,
              bottom: 0,
              left: lineOffset,
            }),
      }}
    >
      <Box
        sx={{
          width: `${terminalSize}px`,
          height: `${terminalSize}px`,
          boxSizing: 'border-box',
          position: 'absolute',
          borderWidth: `${strokeSize}px`,
          borderStyle: 'solid',
          borderColor: theme.vars.palette.primary.main,
          backgroundColor: theme.vars.palette.background.paper,
          borderRadius: '50%',
          ...(orientation === 'horizontal'
            ? { left: `-${terminalSize - insetValue}px` }
            : { top: `-${terminalSize - insetValue}px` }),
        }}
      />
    </Box>
  );
}
