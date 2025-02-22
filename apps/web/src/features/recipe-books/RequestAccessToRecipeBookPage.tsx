import { AddNameDialog } from '#src/components/AddNameDialog';
import { Box, Button, Container, Typography } from '@mui/material';
import {
  useRecipeBookRequests,
  useRequestAccessToRecipeBook,
} from '@open-zero/features/recipe-book-requests';
import { useSignedInUser } from '@open-zero/features/users';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { useSignedInUserId } from '../auth/useSignedInUserId';

const routeApi = getRouteApi('/app/_layout/recipe-books/$recipeBookId');

export function RequestAccessToRecipeBookPage() {
  const userId = useSignedInUserId();
  const { data: user } = useSignedInUser();
  const requestAccessToRecipeBook = useRequestAccessToRecipeBook();
  const { recipeBookId } = routeApi.useParams();
  const { data: requests } = useRecipeBookRequests({
    options: { userId, recipeBookId },
  });
  const [addNameDialogOpen, setAddNameDialogOpen] = useState(false);

  const signedInAs = user?.email ?? 'Guest';

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img src="/assets/lil-guy.svg" width={28} height={28} />
          <Typography
            variant="h1"
            component={'p'}
            sx={{
              fontSize: 16,
              lineHeight: 1,
              ml: 1,
              pt: '0.4rem',
            }}
          >
            Hello Recipes
          </Typography>
        </Box>
        {requests && requests.length > 0 ? (
          <>
            <Typography variant="h1" sx={{ mb: 4 }}>
              Request sent
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h1" sx={{ mb: 4 }}>
              You need access
            </Typography>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => {
                if (!user?.name) {
                  setAddNameDialogOpen(true);
                  return;
                }

                requestAccessToRecipeBook.mutate(recipeBookId);
              }}
              loading={requestAccessToRecipeBook.isPending}
            >
              Request access
            </Button>
          </>
        )}
        <Typography variant="caption">
          You're signed in as {signedInAs}
        </Typography>
      </Container>
      <AddNameDialog
        open={addNameDialogOpen}
        onClose={() => {
          setAddNameDialogOpen(false);

          requestAccessToRecipeBook.mutate(recipeBookId);
        }}
      />
    </Box>
  );
}
