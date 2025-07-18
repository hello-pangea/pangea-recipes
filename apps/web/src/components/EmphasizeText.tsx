import { Typography } from '@mui/material';

export function EmphasizeText({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component={'strong'}
      sx={{
        color: (theme) => theme.vars.palette.primary.main,
        fontSize: 'inherit',
        fontFamily: 'inherit',
        lineHeight: 'inherit',
        fontWeight: 'bold',
      }}
    >
      {children}
    </Typography>
  );
}
