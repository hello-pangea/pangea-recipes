import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { createTagDtoSchema } from '../../common/tag.js';
import { makeRequest } from '../../lib/request.js';
import { defineContract } from '../../lib/routeContracts.js';
import type { MutationConfig } from '../../lib/tanstackQuery.js';
import { recipeSchema } from '../types/recipe.js';

export const createRecipeContract = defineContract('recipes', {
  method: 'post',
  body: z.object({
    ...recipeSchema.pick({ name: true }).shape,
    ...recipeSchema
      .pick({
        description: true,
        prepTime: true,
        cookTime: true,
        servings: true,
        usesRecipes: true,
        nutrition: true,
        tryLater: true,
      })
      .partial().shape,
    imageIds: z.array(z.uuidv4()).optional(),
    websitePageId: z.uuidv4().optional(),
    ingredientGroups: z.array(
      z.object({
        name: z.string().min(1).nullable().optional(),
        ingredients: z.array(
          z.object({
            name: z.string().min(1),
            unit: z.string().min(1).nullable().optional(),
            quantity: z.number().nullable().optional(),
            notes: z.string().min(1).nullable().optional(),
          }),
        ),
      }),
    ),
    instructionGroups: z.array(
      z.object({
        name: z.string().min(1).nullable().optional(),
        instructions: z.array(
          z.object({
            text: z.string().min(1),
          }),
        ),
      }),
    ),
    tags: z
      .array(z.union([z.object({ id: z.uuidv4() }), createTagDtoSchema]))
      .optional(),
  }),
  response: {
    200: z.object({
      recipe: recipeSchema,
    }),
  },
});

const createRecipe = makeRequest(createRecipeContract, {
  select: (res) => res.recipe,
});

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

      void queryClient.invalidateQueries({
        queryKey: ['recipes'],
      });

      void onSuccess?.(...args);
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
