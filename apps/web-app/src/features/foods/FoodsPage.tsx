import { Page } from '#src/components/Page';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useFoods } from '@open-zero/features';
import { FoodCell } from './FoodCell';

export function FoodsPage() {
  const foodsQuery = useFoods();

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Food
      </Typography>
      <Button
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        href="/foods/new"
        size="small"
      >
        New food
      </Button>
      <Stack
        divider={<Divider />}
        alignItems={'stretch'}
        justifyContent={'stretch'}
        sx={{ width: '100%' }}
      >
        {foodsQuery.data?.foods.map((food) => (
          <FoodCell key={food.id} food={food} />
        ))}
      </Stack>
    </Page>
  );
}
