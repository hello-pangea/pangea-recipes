import { Container } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { Recipe } from './Recipe';

const route = getRouteApi('/app/_auth/recipes/$recipeId');

export function RecipePage() {
  const { recipeId } = route.useParams();

  return (
    <Container
      maxWidth="md"
      sx={{
        p: { xs: 2, sm: 3 },
      }}
    >
      <Recipe recipeId={recipeId} />
    </Container>
  );
}
