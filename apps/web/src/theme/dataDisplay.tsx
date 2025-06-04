import { chipClasses } from '@mui/material/Chip';
import { type Components, type Theme } from '@mui/material/styles';
import { color } from './colors';

export const dataDisplayCustomizations: Components<Theme> = {
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        [`& .${chipClasses.label}`]: {
          fontWeight: 600,
        },
        variants: [
          {
            props: {
              color: 'default',
              variant: 'filled',
            },
            style: {
              borderColor: color.slate[200],
              backgroundColor: color.slate[100],
              [`& .${chipClasses.label}`]: {
                color: color.slate[700],
              },
              [`& .${chipClasses.icon}`]: {
                color: color.slate[700],
              },
              [`& .${chipClasses.deleteIcon}`]: {
                color: color.slate[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: color.slate[700],
                backgroundColor: color.slate[800],
                [`& .${chipClasses.label}`]: {
                  color: color.slate[300],
                },
                [`& .${chipClasses.icon}`]: {
                  color: color.slate[300],
                },
                [`& .${chipClasses.deleteIcon}`]: {
                  color: color.slate[500],
                },
              }),
            },
          },
          {
            props: {
              color: 'primary',
              variant: 'filled',
            },
            style: {
              border: '1px solid',
              borderColor: color.indigo[200],
              backgroundColor: color.indigo[50],
              [`& .${chipClasses.label}`]: {
                color: color.indigo[700],
              },
              [`& .${chipClasses.icon}`]: {
                color: color.indigo[700],
              },
              ...theme.applyStyles('dark', {
                borderColor: color.indigo[800],
                backgroundColor: color.indigo[900],
                [`& .${chipClasses.label}`]: {
                  color: color.indigo[200],
                },
                [`& .${chipClasses.icon}`]: {
                  color: color.indigo[300],
                },
              }),
            },
          },
          {
            props: {
              color: 'primary',
              variant: 'outlined',
            },
            style: {
              borderColor: color.indigo[200],
              ...theme.applyStyles('dark', {
                borderColor: color.indigo[800],
              }),
            },
          },
        ],
      }),
    },
  },
};
