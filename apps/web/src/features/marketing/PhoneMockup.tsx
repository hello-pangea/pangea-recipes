import { Box } from '@mui/material';

interface Props {
  src: string;
}

export function PhoneMockup({ src }: Props) {
  return (
    <Box
      sx={{
        width: 250,
        height: 540,
        border: 4,
        pt: 1,
        borderColor: (theme) => theme.vars.palette.text.heading,
        borderRadius: 3,
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        overflow: 'hidden',
        backgroundColor: '#f9f5f3',
      }}
    >
      <img src={src} width="100%" height="100%" alt="" />
    </Box>
  );
}
