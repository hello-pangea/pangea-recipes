import { CreateRecipePage } from '#src/features/recipes/edit-recipe/CreateRecipePage';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_layout/recipes/new')({
  validateSearch: (search) => {
    const res = Value.Parse(
      Type.Object({ importFromUrl: Type.Optional(Type.Boolean()) }),
      search,
    );

    return res;
  },
  component: CreateRecipePage,
});
