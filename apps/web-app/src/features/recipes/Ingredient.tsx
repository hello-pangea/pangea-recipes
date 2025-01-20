import { Box, Checkbox, Typography } from '@mui/material';
import { numberToFraction } from '@open-zero/features';
import { type Recipe } from '@open-zero/features/recipes';
import { useState } from 'react';

interface Props {
  ingredient: Recipe['ingredientGroups'][0]['ingredients'][0];
}

export function Ingredient({ ingredient }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <Box component={'li'} sx={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        sx={{
          p: 0.75,
          mr: 1.5,
        }}
        checked={checked}
        onChange={() => {
          setChecked(!checked);
        }}
      />
      <Box sx={{ mr: 1.5 }}>
        <img
          width={28}
          height={28}
          src={ingredient.icon_url ?? '/assets/ingredients.svg'}
          style={{
            objectFit: 'contain',
            display: 'block',
            opacity: checked ? 0.5 : 1,
          }}
        />
      </Box>
      <Box
        sx={{
          textDecoration: checked ? 'line-through' : 'none',
          opacity: checked ? 0.5 : 1,
        }}
      >
        {ingredient.amount !== null && (
          <Typography
            component={'span'}
            sx={{
              color: (theme) => theme.palette.text.heading,
              fontWeight: 'bold',
            }}
          >
            {numberToFraction(ingredient.amount)}
          </Typography>
        )}{' '}
        {ingredient.unit
          ? `${ingredient.unit} ${ingredient.name}`
          : ingredient.name}
        {ingredient.notes && (
          <Typography
            component={'span'}
            sx={{
              color: (theme) => theme.palette.text.secondary,
              ml: 1,
              fontWeight: 300,
            }}
          >
            ({ingredient.notes})
          </Typography>
        )}
      </Box>
    </Box>
  );
}
