import { Page } from '#src/components/Page';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, Grid2, InputBase, Typography } from '@mui/material';
import { getListRecipeBooksQueryOptions } from '@open-zero/features/recipe-books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';
import { EmptyRecipeBooks } from './EmptyRecipeBooks';
import { RecipeBookCard } from './RecipeBookCard';

export function RecipeBooksPage() {
  const userId = useSignedInUserId();
  const { data: recipeBooks, isError } = useSuspenseQuery(
    getListRecipeBooksQueryOptions({ userId: userId }),
  );
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

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
        sx={{ mb: 4, textAlign: 'center', mt: { xs: 0, sm: 4 } }}
      >
        My Recipe Books
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
              px: 2,
              py: 1,
              gap: 2,
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
          <SearchRoundedIcon />
          <InputBase
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search for a recipe book..."
            sx={{ flex: 1 }}
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={() => {
              setSearchFocused(false);
            }}
          />
        </Box>
      </Box>
      <Grid2 container spacing={2}>
        {filteredRecipeBooks.map((recipeBook) => (
          <Grid2
            key={recipeBook.id}
            size={{
              xs: 12,
              sm: 6,
              lg: 4,
            }}
          >
            <RecipeBookCard recipeBookId={recipeBook.id} />
          </Grid2>
        ))}
      </Grid2>
      {!isError && !recipeBooks.length && <EmptyRecipeBooks sx={{ mt: 8 }} />}
    </Page>
  );
}
