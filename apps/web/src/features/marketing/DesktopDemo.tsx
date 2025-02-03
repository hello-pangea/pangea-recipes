import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, Card, Grid2, InputBase, Typography } from '@mui/material';
import { useState } from 'react';

const recipes = [
  {
    id: '1',
    name: 'Autumn Soup',
    imageUrl: '/assets/autumn-soup.jpg',
  },
  {
    id: '2',
    name: 'Mac & Cheese',
    imageUrl: '/assets/mac-and-cheese.jpg',
  },
  {
    id: '3',
    name: 'Cowboy Spaghetti',
    imageUrl: '/assets/spaghetti.jpg',
  },
  {
    id: '4',
    name: 'Stir Fry',
    imageUrl: '/assets/stir-fry.jpg',
  },
  {
    id: '5',
    name: 'Spiced Latte',
    imageUrl: '/assets/latte.jpg',
  },
  {
    id: '6',
    name: 'No Knead Bread',
    imageUrl: '/assets/bread.jpg',
  },
];

export function DesktopDemo() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <Box
      sx={{
        width: 400,
        height: 280,
        border: 4,
        borderColor: (theme) => theme.palette.text.heading,
        borderRadius: 2,
        px: 2,
        py: 1,
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: 99,
            backgroundColor: (theme) => theme.palette.error.main,
            opacity: 0.5,
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: 99,
            backgroundColor: (theme) => theme.palette.warning.main,
            opacity: 0.5,
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: 99,
            backgroundColor: (theme) => theme.palette.success.main,
            opacity: 0.5,
          }}
        />
      </Box>
      <Typography
        variant="h1"
        component={'p'}
        sx={{ fontSize: 20, textAlign: 'center', mb: 2, mt: 1 }}
      >
        My Recipes
      </Typography>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}
      >
        <Box
          sx={[
            {
              maxWidth: 800,
              borderRadius: 99,
              backgroundColor: (theme) =>
                searchFocused
                  ? theme.palette.background.paper
                  : theme.palette.grey[200],
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              px: 1,
              py: 0.5,
              gap: 1,
              boxShadow: searchFocused
                ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                : undefined,
            },
            (theme) =>
              theme.applyStyles('dark', {
                backgroundColor: searchFocused
                  ? theme.palette.background.paper
                  : theme.palette.grey[900],
              }),
          ]}
        >
          <SearchRoundedIcon sx={{ fontSize: 14 }} />
          <InputBase
            placeholder="Search for a recipe..."
            sx={{ flex: 1, fontSize: 12 }}
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={() => {
              setSearchFocused(false);
            }}
          />
        </Box>
      </Box>
      <Grid2 container spacing={1}>
        {recipes.map((recipe) => (
          <Grid2 size={4} key={recipe.id}>
            <Card
              variant="outlined"
              sx={{
                '&:hover': {
                  boxShadow:
                    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                },
              }}
            >
              <img
                src={recipe.imageUrl}
                height={75}
                width={'100%'}
                style={{ objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {recipe.name}
                </Typography>
              </Box>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
