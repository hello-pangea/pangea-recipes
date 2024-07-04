import { Link, Typography } from '@mui/material';

export function Copyright() {
  return (
    <>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © Reece Carolan '}
        {new Date().getFullYear()}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        <Link href="https://github.com/open-zero/hello-recipes" target="_blank">
          ❤️ Open Source
        </Link>
      </Typography>
    </>
  );
}
