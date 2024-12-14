import { ButtonLink } from '#src/components/ButtonLink';
import { Page } from '#src/components/Page';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Divider, Stack, Typography } from '@mui/material';
import { useCanonicalIngredients } from '@open-zero/features';
import { CanonicalIngredientCell } from './CanonicalIngredientCell';

export function CanonicalIngredientsPage() {
  const canonicalIngredientsQuery = useCanonicalIngredients();

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Canonical ingredient
      </Typography>
      <ButtonLink
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        to="/canonical-ingredients/new"
        size="small"
      >
        New canonical ingredient
      </ButtonLink>
      <Stack
        divider={<Divider />}
        alignItems={'stretch'}
        justifyContent={'stretch'}
        sx={{ width: '100%' }}
      >
        {canonicalIngredientsQuery.data?.canonicalIngredients.map(
          (canonicalIngredient) => (
            <CanonicalIngredientCell
              key={canonicalIngredient.id}
              canonicalIngredient={canonicalIngredient}
            />
          ),
        )}
      </Stack>
    </Page>
  );
}
