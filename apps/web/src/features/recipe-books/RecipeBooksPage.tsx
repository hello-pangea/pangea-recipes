import { Page } from '#src/components/Page';
import { SearchTextField } from '#src/components/SearchTextField';
import { useResizeObserver } from '@mantine/hooks';
import { Box, Grid, Typography } from '@mui/material';
import { listRecipeBooksQueryOptions } from '@repo/features/recipe-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { EmptyRecipeBooks } from './EmptyRecipeBooks';
import { RecipeBookCard } from './RecipeBookCard';

export function RecipeBooksPage() {
  const userId = useSignedInUserId();
  const { data: recipeBooks, isError } = useSuspenseQuery(
    listRecipeBooksQueryOptions({ userId: userId }),
  );
  const [search, setSearch] = useState('');
  const [ref, { width }] = useResizeObserver<HTMLDivElement>();
  const columns = Math.max(1, Math.floor((width + 16) / (256 + 16)));

  const filteredRecipeBooks = useMemo(() => {
    if (search) {
      return recipeBooks.filter((recipeBook) =>
        recipeBook.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return recipeBooks;
  }, [recipeBooks, search]);

  return (
    <Page>
      <Typography
        variant="h1"
        sx={{
          mb: {
            xs: 2,
            sm: 4,
          },
          textAlign: 'center',
          mt: { xs: 0, sm: 4 },
        }}
      >
        My Recipe Books
      </Typography>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}
      >
        <SearchTextField
          value={search}
          onChange={setSearch}
          placeholder="Search for a recipe book..."
        />
      </Box>
      <Grid ref={ref} container spacing={2} columns={columns}>
        {width !== 0 &&
          filteredRecipeBooks.map((recipeBook) => (
            <Grid key={recipeBook.id} size={1}>
              <RecipeBookCard recipeBookId={recipeBook.id} />
            </Grid>
          ))}
      </Grid>
      {!isError && !recipeBooks.length && <EmptyRecipeBooks sx={{ mt: 8 }} />}
    </Page>
  );
}
