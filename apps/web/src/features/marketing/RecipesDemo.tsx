import { Box, Card, Grid2, Typography } from '@mui/material';

const recipes = [
  {
    id: '1',
    name: 'Autumn Soup',
    imageUrl: '/assets/autumn-soup.jpg',
  },
  {
    id: '2',
    name: 'Perfect Mac and Cheese',
    imageUrl: '/assets/mac-and-cheese.jpg',
  },
];

export function RecipesDemo() {
  return (
    <Grid2 container spacing={1}>
      {recipes.map((recipe) => (
        <Grid2
          size={{
            xs: 6,
            sm: 12,
            md: 6,
          }}
          key={recipe.id}
        >
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
              height={200}
              width={'100%'}
              style={{ objectFit: 'cover', display: 'block' }}
              draggable={false}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
              }}
            >
              <Typography
                sx={{
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
  );
}
