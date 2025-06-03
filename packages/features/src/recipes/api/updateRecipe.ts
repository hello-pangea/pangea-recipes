import { Type, type Static } from '@sinclair/typebox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { Nullable } from '../../lib/nullable.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { nutritionSchema } from '../types/nutrition.js';
import { recipeSchema, type Recipe } from '../types/recipe.js';
import { createRecipeDtoScema } from './createRecipe.js';
import { getRecipeQueryOptions } from './getRecipe.js';

export type UpdateRecipeDto = Static<typeof updateRecipeDtoScema>;
export const updateRecipeDtoScema = Type.Partial(
  Type.Composite([
    Type.Pick(recipeSchema, [
      'name',
      'description',
      'prepTime',
      'cookTime',
      'servings',
      'tryLater',
    ]),
    Type.Pick(createRecipeDtoScema, ['usesRecipes', 'tags']),
    Type.Object({
      imageIds: Type.Optional(
        Nullable(Type.Array(Type.String({ format: 'uuid' }))),
      ),
      ingredientGroups: Type.Array(
        Type.Object({
          id: Type.Optional(Type.String({ format: 'uuid' })),
          name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
          ingredients: Type.Array(
            Type.Object({
              id: Type.Optional(Type.String({ format: 'uuid' })),
              name: Type.String({ minLength: 1 }),
              unit: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
              quantity: Type.Optional(Nullable(Type.Number())),
              notes: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
            }),
          ),
        }),
      ),
      instructionGroups: Type.Array(
        Type.Object({
          id: Type.Optional(Type.String({ format: 'uuid' })),
          name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
          instructions: Type.Array(
            Type.Object({
              id: Type.Optional(Type.String({ format: 'uuid' })),
              text: Type.String({ minLength: 1 }),
            }),
          ),
        }),
      ),
      nutrition: Type.Optional(Type.Partial(nutritionSchema)),
    }),
  ]),
);

function updateRecipe(data: UpdateRecipeDto & { id: string }) {
  return api
    .patch(`recipes/${data.id}`, { json: data })
    .then((res) => res.json<{ recipe: Recipe }>());
}

interface Options {
  mutationConfig?: MutationConfig<typeof updateRecipe>;
}

export function useUpdateRecipe({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      const [data] = args;

      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['recipes'],
      });
      queryClient.setQueryData(
        getRecipeQueryOptions(data.recipe.id).queryKey,
        data.recipe,
      );

      void onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateRecipe,
  });
}
