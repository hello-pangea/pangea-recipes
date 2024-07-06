import { FoodsPage } from '#src/features/foods/FoodsPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/foods/')({
  component: FoodsPage,
});
