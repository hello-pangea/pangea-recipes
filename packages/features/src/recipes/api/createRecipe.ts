import { Type, type Static } from '@sinclair/typebox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTagDtoSchema } from '../../common/tag.js';
import { api } from '../../lib/api.js';
import { Nullable } from '../../lib/nullable.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { recipeSchema, type Recipe } from '../types/recipe.js';

export type CreateRecipeDto = Static<typeof createRecipeDtoScema>;
export const createRecipeDtoScema = Type.Composite([
  Type.Pick(recipeSchema, ['name']),
  Type.Partial(
    Type.Pick(recipeSchema, [
      'description',
      'prepTime',
      'cookTime',
      'servings',
      'usesRecipes',
      'nutrition',
    ]),
  ),
  Type.Object({
    imageIds: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
    websitePageId: Type.Optional(Type.String({ format: 'uuid' })),
    ingredientGroups: Type.Array(
      Type.Object({
        name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
        ingredients: Type.Array(
          Type.Object({
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
        name: Type.Optional(Nullable(Type.String({ minLength: 1 }))),
        instructions: Type.Array(
          Type.Object({
            text: Type.String({ minLength: 1 }),
          }),
        ),
      }),
    ),
    tags: Type.Optional(
      Type.Array(
        Type.Union([
          Type.Object({ id: Type.String({ format: 'uuid' }) }),
          createTagDtoSchema,
        ]),
      ),
    ),
  }),
]);

function createRecipe(data: CreateRecipeDto): Promise<Recipe> {
  return api
    .post(`recipes`, { json: data })
    .json<{ recipe: Recipe }>()
    .then((res) => res.recipe);
}

interface Options {
  mutationConfig?: MutationConfig<typeof createRecipe>;
}

export function useCreateRecipe({ mutationConfig }: Options = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['recipeBooks'],
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createRecipe,
  });
}

// const derivedTestSchema = Type.Composite([
//   Type.Partial(Type.Pick(testSchema, ['name'])),
//   PartialNullable(Type.Pick(testSchema, ['optionalName'])),
//   Type.Object({
//     anotherField: Type.String(),
//   }),
// ]);
