import { useUser } from '@clerk/tanstack-start';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Typography } from '@mui/material';
import {
  useRecipeBookRequests,
  useRequestAccessToRecipeBook,
} from '@open-zero/features/recipe-book-requests';
import { getRouteApi } from '@tanstack/react-router';
import { useSignedInUserId } from '../auth/useSignedInUserId';

const routeApi = getRouteApi('/_layout/recipe-books/$recipeBookId');

export function RequestAccessToRecipeBookPage() {
  const { user: clerkUser } = useUser();
  const userId = useSignedInUserId();
  const requestAccessToRecipeBook = useRequestAccessToRecipeBook();
  const { recipeBookId } = routeApi.useParams();
  const { data: requests } = useRecipeBookRequests({
    options: { userId, recipeBookId },
  });

  const signedInAs =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.fullName ??
    'Guest';

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <img src="/assets/lil-guy.svg" width={32} height={32} />
          <Typography
            variant="h1"
            sx={{
              fontSize: 18,
              lineHeight: 1,
              ml: 2,
              pt: '0.4rem',
              color: 'text.secondary',
            }}
          >
            Hello Recipes
          </Typography>
        </Box>
        {requests && requests.length > 0 ? (
          <>
            <Typography variant="h1" sx={{ mb: 2 }}>
              Request sent
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h1" sx={{ mb: 2 }}>
              You need access
            </Typography>
            <LoadingButton
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => {
                requestAccessToRecipeBook.mutate(recipeBookId);
              }}
              loading={requestAccessToRecipeBook.isPending}
            >
              Request access
            </LoadingButton>
          </>
        )}
        <Typography variant="caption">
          You're signed in as {signedInAs}
        </Typography>
      </Container>
    </Box>
  );
}
