import type { SxProps, Theme } from '@mui/material';

// https://github.com/mui/material-ui/issues/37730#issuecomment-2218304523
export function isSxArray(
  sx: SxProps<Theme>,
  // oxlint-disable-next-line typescript/no-explicit-any
): sx is readonly any[] {
  return Array.isArray(sx);
}
