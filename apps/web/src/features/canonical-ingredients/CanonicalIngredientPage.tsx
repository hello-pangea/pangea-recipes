import { Page } from '#src/components/Page';
import { RouterButton } from '#src/components/RouterButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Divider, Stack, Typography } from '@mui/material';
import { listCanonicalIngredientsQueryOptions } from '@repo/features/canonical-ingredients';
import { useQuery } from '@tanstack/react-query';
import { CanonicalIngredientCell } from './CanonicalIngredientCell';

export function CanonicalIngredientsPage() {
  const { data: canonicalIngredients } = useQuery(
    listCanonicalIngredientsQueryOptions(),
  );

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Canonical ingredient
      </Typography>
      <RouterButton
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        to="/app/canonical-ingredients/new"
        size="small"
      >
        New canonical ingredient
      </RouterButton>
      <Stack
        divider={<Divider />}
        alignItems={'stretch'}
        justifyContent={'stretch'}
        sx={{ width: '100%' }}
      >
        {canonicalIngredients?.map((canonicalIngredient) => (
          <CanonicalIngredientCell
            key={canonicalIngredient.id}
            canonicalIngredient={canonicalIngredient}
          />
        ))}
      </Stack>
    </Page>
  );
}
