import { Page } from '#src/components/Page';
import { RouterButton } from '#src/components/RouterButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid2, Typography } from '@mui/material';
import { getListRecipeBooksQueryOptions } from '@open-zero/features/recipe-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { RecipeBookCard } from './RecipeBookCard';

export function RecipeBooksPage() {
  const userId = useSignedInUserId();
  const { data: recipeBooks } = useSuspenseQuery(
    getListRecipeBooksQueryOptions({ userId: userId }),
  );

  return (
    <Page>
      <Typography
        variant="h1"
        sx={{ mb: 4, textAlign: 'center', mt: { xs: 0, sm: 4 } }}
      >
        My Recipe Books
      </Typography>
      <RouterButton
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        to="/recipe-books/new"
        size="small"
      >
        New recipe book
      </RouterButton>
      <Grid2 container spacing={2}>
        {recipeBooks.map((recipeBook) => (
          <Grid2
            key={recipeBook.id}
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
          >
            <RecipeBookCard recipeBookId={recipeBook.id} />
          </Grid2>
        ))}
      </Grid2>
    </Page>
  );
}
