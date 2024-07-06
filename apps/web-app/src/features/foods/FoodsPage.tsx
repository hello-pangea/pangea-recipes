import { ButtonLink } from '#src/components/ButtonLink';
import { Page } from '#src/components/Page';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Divider, Stack, Typography } from '@mui/material';
import { useFoods } from '@open-zero/features';
import { FoodCell } from './FoodCell';

export function FoodsPage() {
  const foodsQuery = useFoods();

  return (
    <Page>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Food
      </Typography>
      <ButtonLink
        startIcon={<AddRoundedIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        to="/foods/new"
        size="small"
      >
        New food
      </ButtonLink>
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
