import { Footer } from '#src/components/Footer';
import { Container } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { Header } from '../marketing/Header';
import { Recipe } from './Recipe';

const route = getRouteApi('/app/shared-recipes/$recipeId');

export function SharedRecipePage() {
  const { recipeId } = route.useParams();

  return (
    <>
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          mb: 8,
        }}
      >
        <Recipe recipeId={recipeId} readOnly />
      </Container>
      <Footer sx={{ pb: 2, pt: 6 }} />
    </>
  );
}
