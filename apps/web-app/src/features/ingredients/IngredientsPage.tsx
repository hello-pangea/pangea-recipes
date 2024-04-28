import { Page } from '#src/components/Page';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useIngredients } from '@open-zero/features';
import { IngredientCell } from './IngredientCell';

export function IngredientsPage() {
  const ingredientsQuery = useIngredients();

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Ingredients
      </Typography>
      <Button
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        href="/ingredients/new"
        size="small"
      >
        New ingredient
      </Button>
      <Stack
        divider={<Divider />}
        alignItems={'stretch'}
        justifyContent={'stretch'}
        sx={{ width: '100%' }}
      >
        {ingredientsQuery.data?.ingredients.map((ingredient) => (
          <IngredientCell key={ingredient.id} ingredient={ingredient} />
        ))}
      </Stack>
    </Page>
  );
}
